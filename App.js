import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

export default function ImagePickerExample() {
  const [image, setImage] = useState({});

  function postApiGoogleVisionVerification() {

    var myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify(
      {
        "requests": [
          {
            "image": {
              "content": `${image.base64}`
            },
            "features": [
              //{ type: "LABEL_DETECTION", maxResults: 10 },
              // { type: "LANDMARK_DETECTION", maxResults: 5 },
              // { type: "FACE_DETECTION", maxResults: 5 },
              // { type: "LOGO_DETECTION", maxResults: 5 },
              // { type: "TEXT_DETECTION", maxResults: 5 },
              // { type: "DOCUMENT_TEXT_DETECTION", maxResults: 5 },
              //sexual analysis content enabled
              { type: "SAFE_SEARCH_DETECTION", maxResults: 5 },
                //sexual analysis content enabled
              //{ type: "IMAGE_PROPERTIES", maxResults: 5 },
              //{ type: "CROP_HINTS", maxResults: 5 },
              //{ type: "WEB_DETECTION", maxResults: 5 }
            ]
          }
        ]
      }
    );

    var requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: raw,
      redirect: 'follow'
    };

    fetch("https://vision.googleapis.com/v1/images:annotate?key=YOUR-API-KEY", requestOptions)
      .then(response => response.json())
      .then(result => {
        console.log(result)
        const data = Object.values(result);

        const res = data.map((el) => {
          return el[0].safeSearchAnnotation
        })
        return res
      })
      .then((res) => {
      })
      .catch(error => console.log('error', error));

  }


  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  useEffect(() => {
    image.uri ? postApiGoogleVisionVerification() : true
  }, [image.uri])

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
      base64: true
    });

    //console.log(result);

    if (!result.cancelled) {
      setImage({
        uri: result.uri,
        base64: result.base64
      });
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Pick an image from camera roll for post in google API baby!!" onPress={pickImage} />
      {image.uri && <Image source={{ uri: image.uri }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}