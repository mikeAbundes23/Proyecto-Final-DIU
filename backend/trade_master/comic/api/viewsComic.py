from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.shortcuts import get_object_or_404

from comic.models import Comic
from user.models import User
from comic.api.serializers import ComicSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def get_comics(request):
    try:
        comics = Comic.objects.all()
        
        if not comics:
            return Response({"message": "No comics found"}, status=status.HTTP_200_OK)
        
        comics_serializer = ComicSerializer(comics, many=True)
        return Response({"data" : comics_serializer.data}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_comics(request):
    try:
        user = get_object_or_404(User, id=request.user.id)
        comics = Comic.objects.filter(seller=user)
        
        if not comics:
            return Response({"message": "No comics found"}, status=status.HTTP_200_OK)
        
        comics_serializer = ComicSerializer(comics, many=True)
        return Response({"data" : comics_serializer.data}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_comic(request, comic_id):
    try:
        comic = get_object_or_404(Comic, id=comic_id)
        comic_serializer = ComicSerializer(comic)
        
        return Response({"data": comic_serializer.data}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST'])
@permission_classes([AllowAny])
def create_comic(request):
    try:
        comic_data = request.data
        print(comic_data)
        
        #user = get_object_or_404(User, id=request.user.id)
        
        comic_data['seller'] = 2

        comic_serializer = ComicSerializer(data=comic_data)
        
        if not comic_serializer.is_valid():
            return Response({"error": comic_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        comic = comic_serializer.save()
        response_serializer = ComicSerializer(comic)
        
        return Response({"message": "Comic created successfully",
                         "data": response_serializer.data }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_comic(request, comic_id):
    try:
        comic = get_object_or_404(Comic, id=comic_id)
        
        if comic.seller.id != request.user.id: # Check if the user is the seller of the comic
            return Response({"error": "You are not authorized to update this comic"}, status=status.HTTP_401_UNAUTHORIZED)
        
        comic_data = request.data
        comic_serializer = ComicSerializer(comic, data=comic_data, partial=True)
        
        if not comic_serializer.is_valid():
            return Response({"error": comic_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
        comic = comic_serializer.save()
        response_serializer = ComicSerializer(comic)
        
        return Response({"message": "Comic updated successfully",
                         "data": response_serializer.data }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_comic(request, comic_id):
    try:
        comic = get_object_or_404(Comic, id=comic_id)
        
        if comic.seller.id != request.user.id:
            return Response({"error": "You are not authorized to delete this comic"}, status=status.HTTP_401_UNAUTHORIZED)
        
        comic.delete()
        return Response({"message": "Comic deleted successfully"}, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)     