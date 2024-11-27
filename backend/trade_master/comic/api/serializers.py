from rest_framework import serializers
from comic.models import Comic, WishList, TradeOffer

class ComicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comic
        fields = '__all__'
        
class WishListSerializer(serializers.ModelSerializer):
    class Meta:
        model = WishList
        fields = '__all__'
        
class MyWishListSerializer(serializers.ModelSerializer):
    comic = ComicSerializer()
    
    class Meta:
        model = WishList
        fields = ['id','comic']