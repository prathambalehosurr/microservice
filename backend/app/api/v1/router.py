from fastapi import APIRouter

from app.api.v1.endpoints import auth, posts, reel, story, user

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(user.router, prefix="/users", tags=["users"])
api_router.include_router(posts.router, prefix="/posts", tags=["posts"])
api_router.include_router(story.router, prefix="/stories", tags=["stories"])
api_router.include_router(reel.router, prefix="/reels", tags=["reels"])
