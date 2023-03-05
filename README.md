<!-- PROJECT LOGO -->
<br />
<div align="center">
<img src="https://user-images.githubusercontent.com/34348870/221376798-866f34c8-5a1e-4194-be8c-b1888ac43f65.png">

  <p align="center" style="margin-top: 30px;">
    Cyclops keeps a watchful eye on your Polkadot validators, giving you a clear vision of their performance and rewards.
    <br />
    <a href="https://cyclops.decentradot.com"><strong>View demo »</strong></a>
    <br />
    <br />
    ·
    <a href="https://github.com/ArthurHoeke/cyclops/issues/new">Report Bug</a>
    ·
    <a href="https://github.com/ArthurHoeke/cyclops/issues/new">Request Feature</a>
  </p>
</div>

<img style="width: 100%; height: 200px;" src="https://raw.githubusercontent.com/w3f/Grants-Program/00855ef70bc503433dc9fccc057c2f66a426a82b/static/img/badge_black.svg">


<!-- ABOUT THE PROJECT -->
## About Cyclops

![image](https://user-images.githubusercontent.com/34348870/221375772-0d258226-c6eb-4267-83ca-8c96553e4298.png)

Cyclops is a validator dashboard application built using Angular and Node/Express that helps Polkadot network validators easily keep track of all their validators, their income, and performance. Cyclops uses the Polkadot Subscan API to gather data and provide a reliable source of validator information.



### Built With

* [![Angular][Angular.io]][Angular-url]
* [![Typescript][Typescriptlang.org]][Typescript-url]
* [![Expressjs][Expressjs.com]][Expressjs-url]
* [![Bootstrap][Bootstrap.com]][Bootstrap-url]
* [![Sass][Sass-lang.com]][Sass-url]



<!-- GETTING STARTED -->
## Getting Started

Cyclops requires both the front-end and back-end to be running in order for the application to work. Each folder has its own readme file with instructions on how to launch the front-end and back-end servers.

### Prerequisites

* Node package manager
  ```sh
  apt install nodejs
  ```
  
* Angular
  ```sh
  npm install -g @angular/cli
  ```

### Front-end

The front-end of Cyclops is built using Angular. For instructions on how to launch the front-end server, please see the readme file located in the front-end folder.

### Back-end

The back-end of Cyclops is built using Node/Express. For instructions on how to launch the back-end server, please see the readme file located in the back-end folder.

<!-- USAGE EXAMPLES -->
## Usage

To use Cyclops, both the front-end and back-end servers need to be running.
First, navigate to the front-end folder and run ```npm install``` to install all the necessary dependencies. Then, ```run ng``` serve to start the front-end server. Next, navigate to the back-end folder and run npm install to install all the necessary dependencies. Finally, run ```node server.js``` to start the back-end server. Once both servers are running, you can navigate to localhost:4200 in your browser to access Cyclops.

_Note that currently only the front-end exists, and the back-end is still under development. Please refer to the individual readme files in each folder for more detailed instructions on how to launch the servers._


<!-- CONTRIBUTING -->
## Contributing

Contributions to Cyclops are welcome and greatly appreciated!

1. Start by forking this repository and creating a new branch for your changes. (`git checkout -b feature/myFeature`)
2. Make your changes and commit them to your branch. (`git commit -m 'Some feature'`) (`git push origin feature/myFeature`)
3. Submit a pull request with your changes

Be sure to provide a clear and detailed description of your changes in the pull request, and include any relevant information about why your changes are important or necessary.

<!-- LICENSE -->
## License

Distributed under the Apache 2.0 License. See `LICENSE.txt` for more information.

[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[Typescriptlang.org]: https://img.shields.io/badge/Typescript-0769AD?style=for-the-badge&logo=typescript&logoColor=white
[Typescript-url]: https://typescriptlang.org
[Expressjs.com]: https://img.shields.io/badge/Express-FFFFFF?style=for-the-badge&logo=express&logoColor=black
[Expressjs-url]: https://expressjs.com/
[Sass-lang.com]:https://img.shields.io/badge/sass-bf4080?style=for-the-badge&logo=sass&logoColor=white
[Sass-url]: https://sass-lang.com/
