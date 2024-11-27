from rest_framework import serializers
from comic.models import Comic, WishList, TradeOffer
from user.api.serializers import UserSerializer, UserShortSerializer

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
        
class TradeOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = TradeOffer
        fields = '__all__'
        
class TradeOfferDetailSerializer(serializers.ModelSerializer):
    comic = ComicSerializer()
    seller = UserShortSerializer()
    trader = UserShortSerializer()
    
    class Meta:
        model = TradeOffer
        fields = '__all__'
        