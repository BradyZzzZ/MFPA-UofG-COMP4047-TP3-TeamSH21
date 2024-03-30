<a name="readme-top"></a>

<p align="left">
  <img src="https://i.imgur.com/8tTQtdY.png" alt="SH21 Team Logo" width='1200' height='auto' />
</p>

<div align="center">
  <img src="https://i.imgur.com/whBuR4b.png" alt="Map File Preparation Application (MFPA)" width='900' height='auto' />
  <br/>

  <h3><b>Map Map File Preparation Application (MFPA)</b></h3>


</div>

<!-- TABLE OF CONTENTS -->

# 📕 Table of Contents

- [📕 Table of Contents](#-table-of-contents)
- [🗺️ Map File Preparation Application (MFPA) ](#️-map-file-preparation-application-mfpa-)
  - [🛠 Built With ](#-built-with-)
    - [Tech Stack ](#tech-stack-)
    - [Key Features ](#key-features-)
  - [🚀 Try It Out! ](#-try-it-out-)
  - [💻 Getting Started ](#-getting-started-)
    - [Setup](#setup)
    - [Install](#install)
    - [Usage](#usage)
    - [Building Executable](#building-executable)
    - [Building Static Export](#building-static-export)
  - [👥 Authors ](#-authors-)
  - [📝 License ](#-license-)
  - [📚 Project Documentation ](#-project-documentation-)
  - [❓ FAQ and Additional Support ](#-faq-and-additional-support-)
<!-- - [🔭 Future Features](#future-features)
- [🤝 Contributing](#contributing)
- [⭐️ Show your support](#support)
- [🙏 Acknowledgements](#acknowledgements)
- [❓ FAQ (OPTIONAL)](#faq) -->

<!-- PROJECT DESCRIPTION -->

# 🗺️ Map File Preparation Application (MFPA) <a name="about-project"></a>

**Map File Preparation Application**: Explore and analyze your map data like never before. Import layers, draw boundaries by hand or coordinates, and instantly discover which layers lie within. Uncover hidden insights and relationships with ease!

## 🛠 Built With <a name="built-with"></a>

### Tech Stack <a name="tech-stack"></a>

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://electronjs.org/">Electron.js</a></li>
    <li><a href="https://nextjs.org/">Next.js</a></li>
    <li><a href="https://tailwindcss.com/">Tailwind CSS</a></li>
    <li><a href="https://nextui.org/">NextUI</a></li>
    <li><a href="https://daisyui.com/">DaisyUI</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://vercel.com/">Vercel</a></li>
  </ul>
</details>

<details>
<summary>Database</summary>
  <ul>
    <li><a href="https://sqlite.org/">SQLite</a></li>
  </ul>
</details>

<!-- Features -->

### Key Features <a name="key-features"></a>

- **Dynamic Layer Management**
- **Intuitive Boundary Creation**
- **Instant layer visibility**

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LIVE DEMO -->

## 🚀 Try It Out! <a name="try-it-out"></a>

According to the order of development time, there are three release versions of software available for running.

You can see the features of each release version and try it as needed.

- [Releases](https://github.com/tuckers1967/MFPA/releases)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## 💻 Getting Started <a name="getting-started"></a>

To get a local copy up and running, follow these steps.

<!-- ### Prerequisites

In order to run this project you need:


Example command:

```sh
 npm install --global yarn
```
or
```sh
 npm install
``` -->


### Setup

Clone this repository to your desired folder:


```sh
  git git@github.com:tuckers1967/MFPA.git
```


### Install

Install dependencies with:

```sh
  yarn install
```
or
```sh
  npm i
```

### Usage

To run the project, execute the following command:

```sh
  yarn dev
```
or
```sh
  npm run dev
```


### Building Executable

You can build an executable using:

```sh
  yarn make
```
or
```sh
  npm run make
```

### Building Static Export

Before building a static export, you have to uncomment these script in `next.config.js` located in the root folder.
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'build',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
```

Then you can build a static export using:

```sh
  yarn build
```
or
```sh
  npm run build
```
- The default output directory will be in the `./build` directory


<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- AUTHORS -->

## 👥 Authors <a name="authors"></a>

👤 **Dulapah Vibulsanti (2920990v)** - Scrum Master, Developer

- GitHub: [@dulapahv](https://github.com/githubhandle)
- LinkedIn: [@LinkedIn](https://linkedin.com/in/dulapahv)
- Email: 2920990v@student.gla.ac.uk

👤 **Mahnun Saratunti (2914049s)** - Product Owner, Developer

- GitHub: [@mahnun](https://github.com/githubhandle)
- LinkedIn: [LinkedIn](https://linkedin.com/in/linkedinhandle)
- Email: 2914049s@student.gla.ac.uk

👤 **Bin Zhang (2941833z)** - Developer

- GitHub: [@bin](https://github.com/BradyZzzZ)
- LinkedIn: [@LinkedIn](https://www.linkedin.com/in/bin-zhang-304171293/)
- Email: 2941833z@student.gla.ac.uk

👤 **Luowan Xu (2710660x)** - Developer

- GitHub: [@luowan](https://github.com/githubhandle)
- LinkedIn: [@LinkedIn](https://linkedin.com/in/linkedinhandle)
- Email: 2710660x@student.gla.ac.uk

👤 **Reuben Spivey (2664429s)** - Note Taker, Developer

- GitHub: [@reuben](https://github.com/githubhandle)
- LinkedIn: [@LinkedIn](https://linkedin.com/in/linkedinhandle)
- Email: 2664429s@student.gla.ac.uk

👤 **Zofia Bochenek (2580917b)** - Developer

- GitHub: [@zofia](https://github.com/githubhandle)
- LinkedIn: [@LinkedIn](https://linkedin.com/in/linkedinhandle)
- Email: 2580917b@student.gla.ac.uk

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- FUTURE FEATURES -->

<!-- ## 🔭 Future Features <a name="future-features"></a>

> Describe 1 - 3 features you will add to the project.

- [ ] **[new_feature_1]**
- [ ] **[new_feature_2]**
- [ ] **[new_feature_3]**

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- CONTRIBUTING -->

<!-- ## 🤝 Contributing <a name="contributing"></a>

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](../../issues/).

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- SUPPORT -->

<!-- ## ⭐️ Show your support <a name="support"></a>

> Write a message to encourage readers to support your project

If you like this project...

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- ACKNOWLEDGEMENTS -->

<!-- ## 🙏 Acknowledgments <a name="acknowledgements"></a>

> Give credit to everyone who inspired your codebase.

I would like to thank...

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- FAQ (optional) -->

<!-- ## ❓ FAQ (OPTIONAL) <a name="faq"></a>

> Add at least 2 questions new developers would ask when they decide to use your project.

- **[Question_1]**

  - [Answer_1]

- **[Question_2]**

  - [Answer_2]

<p align="right">(<a href="#readme-top">back to top</a>)</p> -->

<!-- LICENSE -->

## 📝 License <a name="license"></a>

This project is [MIT](./LICENSE) licensed.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## 📚 Project Documentation <a name="project-documentation"></a>

This is a detailed project [documentation](https://sh21-x-thales-uk.gitbook.io/docs/) powered by GitBook.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## ❓ FAQ and Additional Support <a name="faq-and-additional-support"></a>

If you have any problems or need additional help during use, please feel free to contact us by email.

Find our university email in <a href="#authors">Authors</a> page.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
