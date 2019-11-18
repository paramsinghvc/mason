<!-- PROJECT SHIELDS -->

[![Build Status][build-shield]]()
[![MIT License][license-shield]][license-url]
[![Contributors][contributors-shield]]()
<img src="https://img.badgesize.io/paramsinghvc/mason/master/dist/index.js?style=for-the-badge&compression=gzip&label=gzip+size&max=8000&softmax=4000">
[![LinkedIn][linkedin-shield]][linkedin-url]

<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/paramsinghvc/mason">
    <img src="https://user-images.githubusercontent.com/4329912/59576593-06a31000-90de-11e9-9187-2abbd4009ba4.png" alt="Logo" width="80" height="80">
  </a>

  <p align="center"><h2 align="center">Mason</h2></p>

  <p align="center">
    Building dynamic, eventful, cohesive config driven UI easily
    <br />
    <a href="https://www.npmjs.com/package/@mollycule/mason"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <h4 align="center">Example Screenshot</h4>
    <p align="center">
    <img alt="Rendered UI Screenshot" src="https://user-images.githubusercontent.com/4329912/64925694-43cc8a80-d812-11e9-879d-0d27ceee6e4e.png" width="500" />
    </p>
    </p>
    <p align="center">
    <a href="https://codesandbox.io/s/mason-demo-0tu4t?fontsize=14">View Demo</a>
    ·
    <a href="https://github.com/paramsinghvc/mason/issues">Report Bug</a>
    ·
    <a href="https://github.com/paramsinghvc/mason/issues">Request Feature</a>
    .
    <a href="https://www.npmjs.com/package/@mollycule/mason">NPM Link</a>
    .
    <a href="https://slides.com/paramsingh/building-config-driven-ui-platforms">Slides</a>
  </p>
</p>
<br/>
<!-- TABLE OF CONTENTS -->

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Mason Configuration Semantics](#configuration)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)
- [Acknowledgements](#acknowledgements)

<!-- ABOUT THE PROJECT -->

## About The Project

[![Product Name Screen Shot][product-screenshot]](https://example.com)

Mason is a utility built for dynamically rendering UI components, currently for React environment. All it needs to render a complete UI is a JSON describing the type, id and various other parameters like validation clauses, display clauses and event handling by using a configurative DSL.

It also needs a map of component type vs React component factories to render the corresponding components mentioned in the config.

### Built With

- [TypeScript](https://www.typescriptlang.org/)
- [Webpack](https://webpack.js.org/)

<!-- GETTING STARTED -->

## Getting Started

### Prerequisites

Following Peer Dependencies are required for using mason package:

- react: "^16.8.6"

### Installation

```sh
npm i @mollycule/mason -S
```

or

```sh
yarn add @mollycule/mason
```

<!-- USAGE EXAMPLES -->

## Usage

1. Build the mason config for rendering the UI as per your needs.

```json
{
  "page": "HOME",
  "config": {
    "id": "HomePageLayout",
    "type": "PAGE_LAYOUT",
    "children": [
      {
        "id": "firstSearchInput",
        "type": "SEARCH_INPUT",
        "meta": {
          "disabled": "false",
          "maxLength": 50,
          "minLength": 5,
          "placeholder": "Type here to search"
        },
        "validations": [
          {
            "type": "REQUIRED"
          },
          {
            "type": "REGEX",
            "meta": {
              "pattern": "^\\w{3}\\d{0,2}$"
            }
          },
          {
            "type": "CUSTOM",
            "meta": {
              "functionName": "validateSearch"
            }
          }
        ],
        "events": {
          "change": [
            {
              "type": "AJAX_CALL",
              "meta": {
                "endpoint": "/data/chart-data/${0}/foo/${1}",
                "urlParams": ["firstSearchInput", "<fieldIdHere>"],
                "queryParams": {
                  "foo": "<FieldIdHere>",
                  "bar": "<FieldIdHere>"
                },
                "fieldId": "<FieldId of the field whose data we want to set>"
              }
            }
          ],
          "click": {
            "type": "SET_DATA",
            "meta": {
              "fieldId": "<FieldId>",
              "valueField": "<FieldId>",
              "value": "abc"
            }
          }
        }
      },
      {
        "id": "myListBox",
        "type": "LIST_GROUP",
        "meta": {
          "groupHeading": "Lorem Ipsum",
          "groupSubHeading": "A foxtrot above my head"
        },
        "data": {
          "type": "AJAX_CALL",
          "meta": {
            "endpoint": "/data/chart-data/${0}/foo/${1}",
            "queryParams": {
              "foo": "<FieldIdHere>",
              "bar": "hardcodedText"
            }
          }
        }
      }
    ]
  }
}
```

2. Make use of `ReactRenderer` to build the UI based on the config you created in previous step as

```tsx
import { ReactConfigRenderer } from "@mollycule/mason";
const homePageRenderer = new ReactConfigRenderer(
  config,
  {
    PAGE_LAYOUT: HomePageLayout, 
    SEARCH_INPUT: Search,
    RECIPES_LIST_GROUP: Recipes
  },
  {
    initialValues: { email: "some@example.com", password: "password"},
    dataProcessors: {
      recipeDataSourceProcessor(dataSource) {
        return dataSource.hits.map(h => h.recipe);
      }
    }
  }
);

const HomePage = homePageRenderer.render();
const App = () => <main><HomePage /></main>;

ReactDOM.render(<App/>, document.getElementById("root"));
```

<!-- CONFIGURATION -->

## Mason Configuration

Below is the detailed configuration options that can be done using Mason.

#### 1. Root Node

```json
  {
  "page": "RECIPES",
  "config": {
    "id": "HomePageLayout",
    "type": "PAGE_LAYOUT",
    "style": {
      "display": "grid"
    },
    "children": [...]
  }
```

The root node has a little different structure than rest of the nodes. It has two properties as **`page`** and **`config`** which basically represents the page or route of your web app you're trying to configure the UI for. That said, mason is not limited to page levels only. You can use it to created nested UI as well.
Note: The **`config`** property can be an array of nodes as well striaght-away if you don't want to wrap them in an uber level layout element.

#### 2. Component Node

```json
  {
    "id": "<Unique Component Id>",
    "type": "<Component Type>",
    "meta": {
      "disabled": false,
      "maxLength": 50,
      "placeholder": "Type here to search",
    },
    "show": true,
    "validations": [],
    "events": {},
    "data": {},    
    "style": {
      "display": "grid"
    },
    "children": [...]
  }
```

1. <strong>`id`</strong> field represents the element id used to uniquely identify the current state and updations for a given element. Make sure to keep it unique since this drives any updations during prop change of a given component

2. <strong>`type`</strong> field will help render the corresponding component during the render phase. It'll get matched against the components mapping that's passed while creating the renderer during usage.

      ```tsx
      const homePageRenderer = new ReactConfigRenderer(
        config,
        {
          PAGE_LAYOUT: HomePageLayout, 
          SEARCH_INPUT: SearchInput,
          RECIPES_LIST_GROUP: RecipesListGroup,
          FOO: () => <p>foo</p>
        }
      );
      ```
3. <strong>`meta`</strong> field can be used to pass any properties to an UI Component that'll be added as inline props to the component being rendered. You can pass component props or normal HTML element props in it. 
<i>Note: Setting up `value` property in `meta` is helpful when you want to make your component controllable to avoid React warnings</i>

4. <strong>`show`</strong> property will completely unmount or not render the component in the first place if it evaluated to falsy. It can accept either a boolean or a boolean confguration as
    ```json
    {
      "operator": "!=",
      "leftOperand": "<%statesDropdown%>",
      "rightOperand": "[]",
      "type": "ATOMIC"
    }
    ```

    Here, it'll evaluate the boolean operation as `<Value of statesDropdown> != []` and determine the value of `show`.
     <br/>

    The detailed sturcture of `BooleanConfig` can be understood as the TS type below:

    ```ts
    type BooleanConfig = {
      type: OperationType;
      operator: ComparisonOperators | CompoundOperators;
      leftOperand: string | BooleanConfig;
      rightOperand: string | BooleanConfig;
    };
    ```
    `ComparisonOperators` and `CompoundOperators` are discussed in detail further.

5. <strong>`style`</strong> property simply represents inline styles object passed in the Component.

6. <strong>`data`</strong> property will work as onMount fetching of data. You can specify a remote data source to fetch data asynchronously or set it statically.

    - <strong>`AJAX_CALL`</strong>: The most common scenario is of loading data on mount of a given component. `type` attribute set to `AJAX_CALL` is meant to handle the same. On successful ajax call, it'll set the **`datasource`** prop on the component. Also, when the Ajax call starts, a **`loading`** prop is set to `true` on the component and set as `false` on promise settling (either resolved or caught).
        ```json
        {
          "type": "AJAX_CALL",
          "meta": {
            "endpoint": "https://api.edamam.com/search",
            "queryParams": {
              "q": "egg",
              "app_id": "<app id>",
              "app_key": "<app key>",
              "foo": "<%fieldId%>",
            },
            "credentials": "include",
            "fieldId": "recipesListComponent",
            "dataProcessor": "recipeDataSourceProcessor"
          }
        }
        ```
      - In the **`meta`** config, you can pass things like the **`endpoint`** and dynamic query params can be passed as the key value pairs to it.
      - **`queryParams`** property can incorporate query params value to be set from another component value by enclosing the desired `componentId` or `fieldId` in special syntax as **`<%fieldId%>`**. It'll dynamically take the current value of that component and interpolate it here to make the Ajax Call.
      - **`credentials`** property can be set to control sending same or cross origin [cookies](https://developer.mozilla.org/en-US/docs/Web/API/Request/credentials)
      - **`fieldId`** property can be used to tell which component `datasource` prop you want to set.
      - **`dataProcessor`**: It might be the case that you want to massage or prune the ajax data before applying it to your component. So, you can tailor the data received as per your component needs by passing a function name here that can be referred from the paramters passed by the caller of the mason renderer as:
        ```js
        dataProcessors: {
          recipeDataSourceProcessor(dataSource) {
            return dataSource.hits.map(h => h.recipe);
          }
        }
        ```
        It's like a resolver function that'll be called before applying the datasource prop to the component.
      - **`fieldIds`** is an object that contains key value pairs of fieldIds and their corresponding dataProcessors. It's useful in the cases where in the root level you wanna make an ajax call and set the children's data based on extracting properties from it.



    - <strong>`SET_DATASOURCE`</strong>: To statically set the datasource of the current component or some other component by specifying the optional `fieldId`.
      ```json
      {
        "type": "SET_DATASOURCE",
        "meta": {
          "data": ["foo", "bar"],
          "fieldId": "<fieldIdToSetDataSourceFor>"
        }
      }
      ``` 
    - <strong>`SET_VALUE`</strong>: In case you want to set the value of the current component or some other component on mount of current component.
      ```json
      {
        "type": "SET_VALUE",
        "meta": {
          "value": "foo",
          "fieldId": "<fieldIdToSetValueFor>"
        }
      }
      ``` 
    - <strong>`CUSTOM`</strong>: When you want to execute a custom function on mount of the component. 
      ```json
      {
        "type": "CUSTOM",
        "meta": {
          "name": "<nameOfTheCustomFunction>"
        }
      }
      ``` 
      The Custom function needs to be passed in the `resolvers` map while creating the renderer. It'll be called with one parameter as `({ event, value, id })` from which the values can be destructured during invocation.

6. <strong>`events`</strong> property can either accept a map of event name vs their handlers configuration. Each event could have multiple handlers, hence both the array config and object config is supported. Below is the TypeScript typing for the same.
    ```ts
    events?: {
      [eventName: string]: Array<IEventsConfig> | IEventsConfig;
    }
    ```

    Eg:

    ```json
    "events": {
      "onChange": [
        {
          "type": "SET_VALUE"
        },
        {
          "type": "AJAX_CALL",
          "meta": {
            "endpoint": "https://api.edamam.com/search",
            "queryParams": {
              "q": "<%SELF%>",
              "app_id": "<APP_ID>"
            },
            "dataProcessor": "recipeDataSourceProcessor",
            "fieldId": "recipesListGroup"
          },
          "when": {
            "operator": "=",
            "leftOperand": "<%secondSearchInput%>",
            "rightOperand": "",
            "type": "ATOMIC"
          }
        }
      ],
      "onFocus": {
        "type": "SET_VALUE",
        "meta": {
          "value": [],
          "fieldId": "<fieldIdToSetValueFor>"
        }
      },
      "onClick": [
        {
          "type": "SET_DATASOURCE",
          "meta": {
            "data": [],
            "fieldId": "<fieldIdToSetDataSourceFor>"
          }
        },
        {
          "type": "CUSTOM",
          "meta": {
            "name": "<customFunctionNameHere>"
          }
        }
      ]
    }
    ```

    Here, the **`onChange`** event of the component will execute two event handlers viz set value of itself (required for controlled components - same as setState the value), and the other one makes an ajax call to a remote api to fetch data of a listing component based on the query text entered in the current/self component. 
    Note how the query param is able to take **`<%SELF%>`** as it's value. It's a special value to get the current value of the current component in consideration. You could pass the id of the self component here as well, but it'll give a stale value since this is the event handler which will change it in the end. 
    The **`when`** clause is a conditional clause which is discussed in detail further.

    Next, the **`onFocus`** event is executing a single handler to set the datasource property of the given `fieldId`. No need to pass an array form here.

    And, the **`onClick`** event is useful in case of a button component wherein you want to execute a custom event handler by matching it's name against what was passed in the `dataProcessors` property while creating the Renderer.


8. <strong>`validations`</strong> can be used to configure the form validations on a given component. It's very useful in case of rendering forms. Here's a sample configuration for a simple Login Form.
    ```json
    {
      "page": "FORM",
      "config": [
        {
          "id": "email",
          "type": "TEXTFIELD",
          "meta": {
            "placeholder": "Enter your email",
            "type": "email",
            "value": "",
            "autoComplete": "off"
          },
          "validations": [
            {
              "type": "REQUIRED"
            },
            {
              "type": "LENGTH",
              "meta": {
                "min": 3,
                "max": 50
              }
            },
            {
              "type": "REGEX",
              "meta": {
                "pattern": "^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$"
              }
            }
          ],
          "events": {
            "onChange": [
              {
                "type": "SET_VALUE"
              }
            ]
          },
          "style": {
            "marginBottom": 10
          }
        },
        {
          "id": "password",
          "type": "TEXTFIELD",
          "meta": {
            "value": "Password@123",
            "type": "password",
            "placeholder": "Enter your password"
          },
          "events": {
            "onChange": {
              "type": "SET_VALUE"
            }
          },
          "style": {
            "marginBottom": 10
          },
          "validations": [
            {
              "type": "REGEX",
              "meta": {
                "pattern": "^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$"
              }
            }
          ]
        }
      ]
    }
    ```
    The **`validations`** property expects an array of validation configuration to be supplied. Each configuration has a **`type`** field which can take either of the following values.
    1. **`REQUIRED`** : It'll guard against any value which is a blank string `''`, `undefined` or `null` (and not blank array or objects).
        ```json
        {
          "type": "REQUIRED"
        }
        ```
    2. **`REGEX`** : You can specify a Regular Expression for pattern matching the current value of the component against it.
       ```json
        {
          "type": "REGEX",
          "meta": {
            "pattern": "^(?=.*\\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$"
          }
        }
       ```
    3. **`RANGE`** : To check if the value falls in the numeric range between `min` and `max` in `meta`.
       ```json
        {
          "type": "RANGE",
          "meta": {
            "min": 3,
            "max": 10
          }
        }
       ```
    4. **`LENGTH`** : Can work on both string and array values by checking `value.length` property between the `min` and `max` values specified in `meta`.
       ```json
        {
          "type": "LENGTH",
          "meta": {
            "min": 3,
            "max": 10
          }
        }
       ```
    5. **`JSON`** : To validate the JSON value fed to a component. It'll try to parse it and set a validation error if the parsing fails.
       ```json
        {
          "type": "JSON"
        }
       ```
    6. **`CUSTOM`** : In order to write a custom validator for custom needs.
       ```json
        {
          "type": "CUSTOM",
          "meta": {
            "name": "myCustomValidator"
          }
        }
       ```

       The corresponding validator function has to be specified in the caller environment by passing a **`validators`** object containing these custom validator functions as
       ```ts
       validators: {
          myCustomEmailValidator(value: string) {
            return !value.includes("swiggy") ? "Not a valid swiggy email" : undefined;
          }
        }
       ```
       A validator function takes value as input and returns either a string in case of an invalid value or `undefined` otherwise. `undefined` means there was no error and the value was valid.

9. **`disabled`** clause can be use to pass `disabled` property to the component. It can either take a boolean straight-forwardly or a Conditional config which has the following structure.
    ```ts
    type ConditionalConfig = {
      type: OperationType;
      operator: ComparisonOperators | CompoundOperators;
      leftOperand: string | ConditionalConfig;
      rightOperand: string | ConditionalConfig;
    };
    ```

    The **`OperationType`** can be
      * **`ATOMIC`**: It's like a one level condition. A single expression like `x === true`
      * **`COMPOUND`**: Compound condition can have multiple expressions joined via Compound operators like **`&&`** or **`||`**
    
    The **`operators`** could be either **compound** operators as mentioned above or comparison operators like **`=`, `!=`, `<`, `<=`, `>`, `>=`**

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Param Singh - [@paramsinghvc](https://github.com/paramsinghvc) - paramsinghvc@gmail.com

Project Link: [https://github.com/paramsinghvc/mason](https://github.com/paramsinghvc/mason)

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [Img Shields](https://shields.io)

<!-- MARKDOWN LINKS & IMAGES -->

[build-shield]: https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge
[contributors-shield]: https://img.shields.io/badge/contributors-1-orange.svg?style=for-the-badge
[license-shield]: https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge
[license-url]: https://choosealicense.com/licenses/mit
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=0077B5
[linkedin-url]: https://www.linkedin.com/in/paramsinghvc
[product-screenshot]: https://user-images.githubusercontent.com/4329912/59576904-0d7e5280-90df-11e9-868d-dec257ed1626.png


<p align="center"> Made with ❤️ in Bangalore, India </p>