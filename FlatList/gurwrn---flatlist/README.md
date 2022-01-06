This is part of the _Getting Up and Running With React Native_ series. 

1. A Simple React Native App
2. **Creating an App to Display Data in a FlatList** <--you are here
3. Filtering Data in a FlatList
4. A More Complex Example
5. Refactoring
6. Finding and Using Interesting Data Sources

In continuing the theme of this series. I will focus on somewhat "vanilla" React Native and I will show my examples using [expo.dev's](https://expo.dev) wonderful [snack](https://snack.expo.dev) tool, which I feel is the easiest way to practice React Native coding. Preparing apps for production is outside the scope of this series. 

By a "vanilla" approach I mean that I will draw primarily from examples from documentation, avoid time worrying about layout or style, and otherwise stick close to idiomatic React Native coding. I will also limit the use of outside modules as much as possible, except when there is much to be gained in their use. This series should considered a practical interpretation of a small portion of the very large and rich React Native world. 

## The Setup

Here is code adapted from the [FlatList documentation](https://reactnative.dev/docs/flatlist) to get us started. I've omitted imports and style, but you can check out the finished code example [here](). 

```jsx
// App.js
// imports
export default function App() {
  const [data, setData] = useState([{id:1,value:'a'},{id:2,value:'b'},{id:3,value:'c'}])

  const renderItem = ({ item }) => (
    <Card>
      <Card.Title title={item.value} subtitle={item.id} />
    </Card>
  );

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
// styles
```

FlatList is a very useful React Native component. You give it an array of what you want to display (the `data` prop) and explain how you want to display each item (the `renderItem` prop), and let it do its thing. 

### The `keyExtractor` prop

The `keyExtractor` prop is not exactly required to make a `FlatList` work, but it is a good habit to make sure that all of your list elements have unique identifiers, and to pass that information on to your `FlatList`. What is passed in as a prop is extremely idiomatic React Native code, and so may be a bit disorientating. 

The prop here is a function definition. The function takes `item` as a parameter, and returns `item.id`. `item` is what FlatList calls each element of the array, and `id` is the field that contains the unique id. If your data contained timestamps, for instance, the piece to the right of the arrow (`=>`) might be: `item.timestamp`.

### The `data` prop

This is your data source. It must be an array. If you have data that isn't an array, you'll need to manipulate it somehow to make it into an array. In our example, our data is stored in a state variable called `data`, which I (in an example of not so great practice) initialized with stand-in data.[^1]. We will come back to this in a bit. It is, however, important to understand the "shape" of the items in our array. That will be important for `renderItem`.

### The `renderItem` prop

This is how `FlatList` knows how to display each item in your data array. The value in the prop is `renderItem`, but is actually a function name. The authors of the documentation named it that, but they could have well named it `steve`. You could name your function whatever you want, or, as in the `keyExtractor` example, define it anonymously. That tends to ugly up the code a bit for anything but the simplest items. 

### The `renderItem` function

Here is where you define how to display each item in your data. How you go about doing this is entirely up to you and should be based on the shape of your data. I've kept it simple here, but this will change dramatically soon. It should be pointed out, however, that the current form of the function simply returns JSX needed to display the item, but you may want to perform calculations on the item as part of the display. In this case the syntax will change slightly. This could be a gotcha! 

## Getting Real Data

There's a lot that could be said about finding an interesting data source and setting up your access to that data source, which will address later, but for now we will use something very easy: fake data provided by the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) project. For now, we will use the "posts" option. 

With our data source identified, we now need to bring this data into our program. To do this, we will make use of an important React Native feature called `useEffect`.

### `useEffect`

The written details about `useEffect` I find to be either quite technical or not clear enough for what is a relatively simple concept. I hope to demystify this useful tool here. 

```js
useEffect( thingToDo, [optionally,when,to,do,it]);
```

As you can see, it is just a JavaScript function. Unfortunately, most `useEffect`s look something like this (this is the one we are going to use, actually). 

```js
useEffect( () => {
  const getPosts = () => {
    fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(json => {setData(json)})
  }
  getPosts();
}, [])
```
Before going in to detail about what is happening here, let's take a step back and think about what we want to have happen: _when the app loads, retrieve the data, and store it into the `data` state variable_. Also recall that `useEffect` takes two parameters, a function, and an optional array. This is exactly what we have. 

The problem is that the function we've passed in is an anonymous function (`()=>{...}`) and inside that anonymous function we've declared another function (`getPosts`) and then called that function. It is bizarre and idiomatic [^2].

#### `getPosts`

This function is simply a wrapper around (a slightly modified) version of the example given on the JSONPlaceholder page of how to access the data. We use JavaScript's `fetch` function, which runs asynchronously. `.then` statements indicate what should happen after the asynchronous part resolves successfully[^3], which is effectively getting the JSON part of the response, and then passing that along to our `setData` function. 

After the function declaration, but still inside of the `useEffect` we call the function. 

#### The dependency array

The other confusing part of `useEffect` is its second (optional) parameter called "the dependency array". This parameter controls when the "effect" happens. There are three possiblities:

* if there is no dependency array, the effect will run constantly. In our case, this is not what we want because each effect fetches data from the api and that is not ideal for myriad reasons[^4]
* if there is an empty dependency array, the effect will run once[^5]. 
* if there is a state variable in the dependency array, the effect will run when that variable changes. 

## Displaying The Real Data

Now, we need to update `renderItem` to match the shape of the data in our array. Here is an example of the data:

```json
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  },
```

And our updated `renderItem`:

```jsx
const renderItem = ({ item }) => (
  <Card>
    <Card.Title title={item.title} subtitle={`User: ${item.userId}`} />
    <Card.Content>
      <Text>{item.body}</Text>
    </Card.Content>
  </Card>
);
```

You can see that I've simply expanded the structure to make it accommodate the blog post nature of the data, and then populated various parts with appropriate data from the item. 

### One Last Thing

I think there's something odd in the body of the posts... a bunch of `\n`s. These are line breaks, and we are somewhat lucky they rendered correctly in our app. However, we could take control of 
this a bit. 

```jsx
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
```

First, notice the slightly different syntax of the `renderItem` definition (after the arrow): we went from `({item}) => ()` to `({item}) => {...return()}`. We are allowed to skip the curly braces and return statement since we weren't doing anything "JavaScripty" in the function, but now that we are more than just returning JSX, we have to add them. Notice the parantheses 

Second, since we know the line breaks (`\n`) are present, we can `split` the string containing them by that value. 

Then, we take the array `split` gives us, and we use `map` to piece it back together surrounded by `<Paragraph>` components. The result then gets inserted into the `<Card.Content>` component. 

Here's the final code! 
* As a [snack](https://snack.expo.dev/@joswald.ga/gurwrn---flatlist)
* In [github]

## Resources
### Documentation
* [FlatList](https://reactnative.dev/docs/flatlist#keyextractor) - It should be noted that FlatList is extremely powerful beyond what we've shown here. 
* [useEffect](https://reactjs.org/docs/hooks-reference.html#useeffect)
* [React Native Paper](https://callstack.github.io/react-native-paper/index.html) (we used, Card and Paragraph in this example)

### Miscellany
* [useEffect Basics](https://www.reactjstutorials.com/react-basics/26/react-useeffect)
* [JSONPlaceholder](https://jsonplaceholder.typicode.com/)


## Footnotes
[^1]: as an interesting aside, I experienced bizarre behavior when using 0 for the `id` field, probably becuase of how JavaScript coalesces that particular value. In any case, having an id of 0 doesn't make any sense, so I ended up changing it. 
[^2]: I suspect that the reason it is so common to see this pattern is because many uses of `useEffect` run asynchronously, and this is an effective pattern with which to handle it. 
[^3]: We should also be using `.catch` to deal with `fetch` failures.
[^4]: It is costly in terms of time and performance, but if you're paying for API access, it could also be costly in terms of money. 
[^5]: It runs after the first rendering of the app, which will then trigger another render. 