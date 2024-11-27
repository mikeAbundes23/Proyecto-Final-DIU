from rest_framework import serializers
from comic.models import Comic

class ComicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comic
        fields = '__all__'