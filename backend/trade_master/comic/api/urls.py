from django.urls import path
from rest_framework.routers import DefaultRouter
from comic.api.viewsComic import get_comics, create_comic, get_comic, delete_comic, update_comic, my_comics
from comic.api.viewsWishList import add_to_wishlist, get_wishlist, delete_item

router = DefaultRouter()

urlpatterns = [
    *router.urls,
    # Comics
    path('comics/', get_comics, name='get_comics'),
    path('comics/create/', create_comic, name='create_comic'),
    path('comics/<int:comic_id>/', get_comic, name='get_comic'),
    path('comics/delete/<int:comic_id>/', delete_comic, name='delete_comic'),
    path('comics/update/<int:comic_id>/', update_comic, name='update_comic'),
    path('comics/my-comics/', my_comics, name='my_comics'),
    # Wishlist
    path('comics/wishlist/add/<int:comic_id>/', add_to_wishlist, name='add_to_wishlist'),
    path('comics/wishlist/', get_wishlist, name='get_wishlist'),
    path('comics/wishlist/delete/<int:comic_id>/', delete_item, name='delete_item'),
]