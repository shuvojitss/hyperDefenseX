import os
from urllib.parse import urlencode

from authlib.integrations.starlette_client import OAuth
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, RedirectResponse
from fastapi.middleware.cors import CORSMiddleware
from supabase import Client, create_client
from starlette.middleware.sessions import SessionMiddleware


def load_env_file() -> None:
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if not os.path.exists(env_path):
        return

    with open(env_path, "r", encoding="utf-8") as env_file:
        for raw_line in env_file:
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue

            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            os.environ.setdefault(key, value)


load_env_file()


SECRET_KEY = os.environ.get("SECRET_KEY", "your_secret_key")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
BACKEND_URL = os.environ.get("BACKEND_URL", "http://localhost:8000")
SUPABASE_URL = os.environ.get("SUPABASE_URL", "").strip()
SUPABASE_KEY = os.environ.get("SUPABASE_KEY", "").strip()

app = FastAPI(title="Cyber Defense Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)


oauth = OAuth()
oauth.register(
    name="google",
    client_id=os.environ.get("GOOGLE_CLIENT_ID"),
    client_secret=os.environ.get("GOOGLE_CLIENT_SECRET"),
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={"scope": "openid email profile"},
)
oauth.register(
    name="github",
    client_id=os.environ.get("GITHUB_CLIENT_ID"),
    client_secret=os.environ.get("GITHUB_CLIENT_SECRET"),
    access_token_url="https://github.com/login/oauth/access_token",
    authorize_url="https://github.com/login/oauth/authorize",
    api_base_url="https://api.github.com/",
    client_kwargs={"scope": "user:email"},
)


supabase: Client | None = None


def get_supabase() -> Client:
    global supabase
    if supabase:
        return supabase

    if not SUPABASE_URL or not SUPABASE_KEY:
        raise RuntimeError("SUPABASE_URL and SUPABASE_KEY must be configured in backend/.env")

    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase


def is_duplicate_user_error(exc: Exception) -> bool:
    message = str(exc).lower()
    return "duplicate key" in message or "users_username_key" in message


def get_user_by_filters(**filters):
    query = get_supabase().table("users").select("*")
    for key, value in filters.items():
        query = query.eq(key, value)
    result = query.limit(1).execute()
    return result.data[0] if result.data else None


def create_user(fullname: str, username: str, password: str | None = None, oauth_provider: str | None = None, oauth_id: str | None = None):
    payload = {
        "fullname": fullname,
        "username": username,
        "password": password,
        "oauth_provider": oauth_provider,
        "oauth_id": oauth_id,
    }
    result = get_supabase().table("users").insert(payload).execute()
    return result.data[0] if result.data else get_user_by_filters(username=username)


def update_user_oauth(username: str, oauth_provider: str, oauth_id: str):
    get_supabase().table("users").update({"oauth_provider": oauth_provider, "oauth_id": oauth_id}).eq("username", username).execute()
    return get_user_by_filters(username=username)


@app.get("/", response_class=HTMLResponse)
async def index() -> str:
    return "<h1>Backend is running</h1>"


@app.get("/signup", response_class=HTMLResponse)
async def signup_page() -> str:
    return "<h1>Signup endpoint is available</h1>"


@app.post("/signup")
async def signup(request: Request):
    form = await request.form()
    fullname = (form.get("fullname") or "").strip()
    username = (form.get("username") or "").strip()
    password = (form.get("password") or "")

    if not fullname or not username or not password:
        return JSONResponse(
            {"success": False, "message": "All fields are required"},
            status_code=400,
        )

    try:
        create_user(fullname=fullname, username=username, password=password)
        return RedirectResponse(url="/login", status_code=302)
    except Exception as exc:
        if is_duplicate_user_error(exc):
            return JSONResponse(
                {"success": False, "message": "Username already exists"},
                status_code=409,
            )
        return JSONResponse(
            {"success": False, "message": "Internal server error"},
            status_code=500,
        )


@app.get("/login", response_class=HTMLResponse)
async def login_page() -> str:
    return "<h1>Login endpoint is available</h1>"


@app.post("/login")
async def login(request: Request):
    form = await request.form()
    username = (form.get("username") or "").strip()
    password = (form.get("password") or "")

    if not username or not password:
        return JSONResponse(
            {"success": False, "message": "Username and password are required"},
            status_code=400,
        )

    user = get_user_by_filters(username=username, password=password)

    if user:
        request.session["username"] = user["username"]
        request.session["fullname"] = user["fullname"]
        return RedirectResponse(url="/home", status_code=302)

    return JSONResponse(
        {"success": False, "message": "Invalid credentials"},
        status_code=401,
    )


@app.post("/api/signup")
async def api_signup(request: Request):
    data = await request.json()
    fullname = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not fullname or not email or not password:
        return JSONResponse(
            {"success": False, "message": "Name, email, and password are required"},
            status_code=400,
        )

    try:
        create_user(fullname=fullname, username=email, password=password)
        return JSONResponse(
            {"success": True, "message": "Account created successfully"},
            status_code=201,
        )
    except Exception as exc:
        if is_duplicate_user_error(exc):
            return JSONResponse(
                {
                    "success": False,
                    "message": "An account with this email already exists. Please login.",
                },
                status_code=409,
            )
        return JSONResponse(
            {"success": False, "message": "Internal server error"},
            status_code=500,
        )


@app.post("/api/login")
async def api_login(request: Request):
    data = await request.json()
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return JSONResponse(
            {"success": False, "message": "Email and password are required"},
            status_code=400,
        )

    try:
        user = get_user_by_filters(username=email, password=password)

        if not user:
            return JSONResponse(
                {
                    "success": False,
                    "message": "Incorrect email or password. Please try again.",
                },
                status_code=401,
            )

        request.session["username"] = user["username"]
        request.session["fullname"] = user["fullname"]

        return JSONResponse(
            {
                "success": True,
                "user": {"name": user["fullname"], "email": user["username"]},
            }
        )
    except Exception:
        return JSONResponse(
            {"success": False, "message": "Internal server error"},
            status_code=500,
        )


@app.get("/home")
async def home(request: Request):
    if "username" in request.session:
        return JSONResponse(
            {
                "username": request.session.get("username"),
                "fullname": request.session.get("fullname"),
            }
        )
    return RedirectResponse(url="/login", status_code=302)


@app.get("/logout")
async def logout(request: Request):
    request.session.pop("username", None)
    request.session.pop("fullname", None)
    return RedirectResponse(url="/login", status_code=302)


@app.get("/auth/google")
async def google_login(request: Request):
    redirect_uri = f"{BACKEND_URL}/auth/google/callback"
    return await oauth.google.authorize_redirect(request, redirect_uri)


@app.get("/auth/google/callback")
async def google_callback(request: Request):
    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get("userinfo")

        if not user_info:
            user_info = (await oauth.google.get("https://openidconnect.googleapis.com/v1/userinfo", token=token)).json()

        oauth_id = user_info.get("sub")
        email = user_info.get("email")
        name = user_info.get("name", email.split("@")[0])

        user = get_user_by_filters(oauth_provider="google", oauth_id=oauth_id)

        if not user:
            existing = get_user_by_filters(username=email)

            if existing:
                user = update_user_oauth(username=email, oauth_provider="google", oauth_id=oauth_id)
            else:
                user = create_user(
                    fullname=name,
                    username=email,
                    oauth_provider="google",
                    oauth_id=oauth_id,
                )

        request.session["username"] = user["username"]
        request.session["fullname"] = user["fullname"]

        params = urlencode(
            {
                "name": user["fullname"],
                "email": user["username"],
                "provider": "google",
            }
        )
        return RedirectResponse(url=f"{FRONTEND_URL}/oauth/success?{params}", status_code=302)
    except Exception as exc:
        params = urlencode({"error": str(exc)})
        return RedirectResponse(url=f"{FRONTEND_URL}/login?{params}", status_code=302)


@app.get("/api/auth/google/callback")
async def api_google_callback(request: Request):
    try:
        code = request.query_params.get("code")
        if not code:
            return JSONResponse(
                {"success": False, "message": "No authorization code provided"},
                status_code=400,
            )

        token = await oauth.google.authorize_access_token(request)
        user_info = token.get("userinfo")

        if not user_info:
            user_info = (await oauth.google.get("https://openidconnect.googleapis.com/v1/userinfo", token=token)).json()

        oauth_id = user_info.get("sub")
        email = user_info.get("email")
        name = user_info.get("name", email.split("@")[0])

        user = get_user_by_filters(oauth_provider="google", oauth_id=oauth_id)

        if not user:
            existing = get_user_by_filters(username=email)

            if existing:
                user = update_user_oauth(username=email, oauth_provider="google", oauth_id=oauth_id)
            else:
                user = create_user(
                    fullname=name,
                    username=email,
                    oauth_provider="google",
                    oauth_id=oauth_id,
                )

        request.session["username"] = user["username"]
        request.session["fullname"] = user["fullname"]

        return JSONResponse(
            {
                "success": True,
                "user": {"name": user["fullname"], "email": user["username"]},
            }
        )
    except Exception as exc:
        return JSONResponse(
            {"success": False, "message": str(exc)},
            status_code=500,
        )


@app.get("/auth/github")
async def github_login(request: Request):
    redirect_uri = f"{BACKEND_URL}/auth/github/callback"
    return await oauth.github.authorize_redirect(request, redirect_uri)


@app.get("/auth/github/callback")
async def github_callback(request: Request):
    try:
        token = await oauth.github.authorize_access_token(request)

        resp = await oauth.github.get("user", token=token)
        user_info = resp.json()

        oauth_id = str(user_info.get("id"))
        username = user_info.get("login")
        name = user_info.get("name") or username

        email_resp = await oauth.github.get("user/emails", token=token)
        emails = email_resp.json()
        email = next((e["email"] for e in emails if e.get("primary")), f"{username}@github.local")

        user = get_user_by_filters(oauth_provider="github", oauth_id=oauth_id)

        if not user:
            existing = get_user_by_filters(username=username)

            if existing:
                user = update_user_oauth(username=username, oauth_provider="github", oauth_id=oauth_id)
            else:
                user = create_user(
                    fullname=name,
                    username=username,
                    oauth_provider="github",
                    oauth_id=oauth_id,
                )

        request.session["username"] = user["username"]
        request.session["fullname"] = user["fullname"]

        params = urlencode(
            {
                "name": user["fullname"],
                "email": email,
                "provider": "github",
            }
        )
        return RedirectResponse(url=f"{FRONTEND_URL}/oauth/success?{params}", status_code=302)
    except Exception as exc:
        params = urlencode({"error": str(exc)})
        return RedirectResponse(url=f"{FRONTEND_URL}/login?{params}", status_code=302)


@app.get("/api/auth/github/callback")
async def api_github_callback(request: Request):
    try:
        code = request.query_params.get("code")
        if not code:
            return JSONResponse(
                {"success": False, "message": "No authorization code provided"},
                status_code=400,
            )

        token = await oauth.github.authorize_access_token(request)

        resp = await oauth.github.get("user", token=token)
        user_info = resp.json()

        oauth_id = str(user_info.get("id"))
        username = user_info.get("login")
        name = user_info.get("name") or username

        email_resp = await oauth.github.get("user/emails", token=token)
        emails = email_resp.json()
        email = next((e["email"] for e in emails if e.get("primary")), f"{username}@github.local")

        user = get_user_by_filters(oauth_provider="github", oauth_id=oauth_id)

        if not user:
            existing = get_user_by_filters(username=username)

            if existing:
                user = update_user_oauth(username=username, oauth_provider="github", oauth_id=oauth_id)
            else:
                user = create_user(
                    fullname=name,
                    username=username,
                    oauth_provider="github",
                    oauth_id=oauth_id,
                )

        request.session["username"] = user["username"]
        request.session["fullname"] = user["fullname"]

        return JSONResponse(
            {
                "success": True,
                "user": {"name": user["fullname"], "email": email},
            }
        )
    except Exception as exc:
        return JSONResponse(
            {"success": False, "message": str(exc)},
            status_code=500,
        )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)