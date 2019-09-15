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

  <h1 align="center">Mason</h1>

  <p align="center">
    Building dynamic, eventful, cohesive config driven UI easily
    <br />
    <a href="https://www.npmjs.com/package/@mollycule/mason"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <h4 align="center">Example Screenshot</h4>
    <img alt="Rendered UI Screenshot" src="https://user-images.githubusercontent.com/4329912/64925694-43cc8a80-d812-11e9-879d-0d27ceee6e4e.png" />
    </p>
    <p align="center">
    <a href="https://codesandbox.io/s/mason-demo-0tu4t?fontsize=14">View Demo</a>
    ·
    <a href="https://github.com/paramsinghvc/mason/issues">Report Bug</a>
    ·
    <a href="https://github.com/paramsinghvc/mason/issues">Request Feature</a>
    .
    <a href="https://www.npmjs.com/package/@mollycule/mason">NPM Link</a>
  </p>
</p>

<!-- TABLE OF CONTENTS -->

## Table of Contents

- [About the Project](#about-the-project)
  - [Built With](#built-with)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
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
  new Map([
    ["PAGE_LAYOUT", HomePageLayout], 
    ["SEARCH_INPUT", Search],
    ["RECIPES_LIST_GROUP", Recipes]
  ]),
  {
    dataProcessors: {
      recipeDataSourceProcessor(dataSource) {
        return dataSource.hits.map(h => h.recipe);
      }
    }
  }
);

const App = () => <main>{homePageRenderer.render()}</main>;

ReactDOM.render(<App/>, document.getElementById("root"));
```

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

- [GitHub Emoji Cheat Sheet](https://www.webpagefx.com/tools/emoji-cheat-sheet)
- [Img Shields](https://shields.io)

<!-- MARKDOWN LINKS & IMAGES -->

[build-shield]: https://img.shields.io/badge/build-passing-brightgreen.svg?style=for-the-badge
[contributors-shield]: https://img.shields.io/badge/contributors-1-orange.svg?style=for-the-badge
[license-shield]: https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge
[license-url]: https://choosealicense.com/licenses/mit
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=0077B5
[linkedin-url]: https://www.linkedin.com/in/paramsinghvc
[product-screenshot]: https://user-images.githubusercontent.com/4329912/59576904-0d7e5280-90df-11e9-868d-dec257ed1626.png
