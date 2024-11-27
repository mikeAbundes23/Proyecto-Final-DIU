from django.urls import path
from rest_framework.routers import DefaultRouter
from comic.api.viewsComic import get_comics, create_comic, get_comic, delete_comic, update_comic


router = DefaultRouter()

urlpatterns = [
    *router.urls,
    path('comics/', get_comics, name='get_comics'),
    path('comics/create/', create_comic, name='create_comic'),
    path('comics/<int:comic_id>/', get_comic, name='get_comic'),
    path('comics/delete/<int:comic_id>/', delete_comic, name='delete_comic'),
    path('comics/update/<int:comic_id>/', update_comic, name='update_comic'),
]