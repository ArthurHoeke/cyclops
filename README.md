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

![image](https://github.com/ArthurHoeke/cyclops/assets/34348870/cb92be98-13e5-49a7-a546-2bb7976e242d)


Cyclops is a validator dashboard application built using Angular and Node/Express that helps Polkadot network validators easily keep track of all their validators, their income, and performance. Cyclops uses the Polkadot Subscan API to gather data and provide a reliable source of validator information.



### Built With

* [![Angular][Angular.io]][Angular-url]
* [![Typescript][Typescriptlang.org]][Typescript-url]
* [![Expressjs][Expressjs.com]][Expressjs-url]
* [![Sqlite][Sqlite.org]][Sqlite-url]
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

First, navigate to the front-end folder and run `npm install` to install all the necessary dependencies. Then, run `ng serve` to start the front-end server. Next, navigate to the back-end folder and run `npm install` to install all the necessary dependencies. Finally, run `npm start` to start the back-end server. Once both servers are running, you can navigate to localhost:4200 in your browser to access Cyclops.

*Please refer to the individual readme files in each folder for more detailed instructions on how to setup the servers.*

By default cyclops will run over the HTTP protocol, note that this is only meant for internal testing. HTTP should never be used for production, and will cause API issues with the w3f 1kv end-points. Once you have confirmed Cyclops to be running properly locally, you should obtain an SSL certificate and enable HTTPS by doing the following:

1. Obtain an SSL certificate.
I'd highly recommend using [letsencrypt](https://letsencrypt.org/), a service which provides free SSL certificates. The next couple of bullet points will go over obtaining a certificate using letsencrypt, if you're using your own method please skip to bullet point `4`.
2. Install letsencrypt's certbot
`sudo add-apt-repository ppa:certbot/certbot`
`sudo apt-get update`
`sudo apt-get install certbot`
3. Generate your certificate using `certbot certonly --manual` and follow the setup steps.
4. Uncomment the following lines from app.js: `24`, `25`, `26`, `28`, `29`, `30`, `31`, `32`, `69` and replace the variable `app` with `server` on line `98`. If you are not using certbot, please replace the paths of privkey.pem, cert.pem and chain.pem.

Once the back-end server is running using HTTPS, make sure to adjust the front-end API end-point on [this line](https://github.com/ArthurHoeke/cyclops/blob/9acdabcff868fe93636a71d917bee119e8605b50/front-end/src/app/services/api/api.service.ts#L16) and create a build of the front-end using `ng build`. `ng serve` should never be used to host the production front-end.

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
[Sqlite.org]:https://img.shields.io/badge/sqlite-044a64?style=for-the-badge&logo=sqlite&logoColor=white
[Sqlite-url]: https://sqlite.org/
