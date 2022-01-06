import * as React from 'react';
import {useState, useEffect} from 'react';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import Constants from 'expo-constants';
import { Card, Paragraph } from 'react-native-paper';

export default function App() {
  const [data, setData] = useState([])

  useEffect( () => {
    const getPosts = () => {
      fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(json => {setData(json)} )
    }
    console.log("going and...")
    getPosts();
  },[])

  const renderItem = ({ item }) => {
    const paragraphs = item.body.split("\n").map(paragraph=><Paragraph>{paragraph}</Paragraph>);
    return (
      <Card>
        <Card.Title title={item.title} subtitle={`User: ${item.userId}`} />
        <Card.Content>
          {paragraphs}
        </Card.Content>
      </Card>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
