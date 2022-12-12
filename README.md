# University project for subject: Software Architecture

**Purpose:** The goal of this project is to showcase my coding abilities and practices developed during my fourth year at university (Bachelor degree in Computer Science).

**Full documentation:** An extensive and detailed documentation can be found <a href="./documentation/Arquitectura de Software OBL 1.pdf">here</a>

**Disclaimer:** The project was developed and documented in 2021 with two other students in a private repository. In 2022, I republished it on a public repository and made some updates, including this README file.

<br/>

<div style="display: flex;">
    <a href="https://github.com/tomyda">
  	    <img src="./Resources/img/mimoji%20-%20Low.png" alt="Tommy's Photo" width="100" height="95" style="border-radius: 50%;">
    </a>
    <div style="width: 1rem"> </div>
    <div style="display: flex, flex-direction: column;">
        <b>
        Contributor 
        </b>
        <p>
        Tomás De Angelis (https://www.github.com/tomyda)
        </p>
        <a href="https://www.linkedin.com/in/tom%C3%A1s-de-angelis-776568194/">
        Reach out via LinkedIn!
        </a>
    </div>
</div>

<br/>

# README

<h4 align="center">This README file describes the npm modules used in this project and their purpose.</h4>
<p align="center">
  <a href="#key-services-and-features">Key Services and Features</a> •
  <a href="#dependencies">Dependencies</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#documentation">Documentation</a> •
  <a href="#faq">FAQ</a>
</p>

## Key Services and Features

#### Admin Service

#### Auth Service

#### IdProviderMock Service

#### Logger

#### NotificationService

#### PendingService

#### ReservationData

#### ReservationEmitter

#### ReservationProcessor

#### VacQueryTools

</br>

## Dependencies

#### Admin Service

- uuid (used for generating vaccination center uuid -"code"-)
- generate-password (used for generating admins random, secure, password)
- bcryptjs (used for hashing user password -for security-)
- validator (used for validating email structurally)

#### Auth Service

- express (for server)
- mongoose (for mongodb connection)
- nodemon (for faster/easyer development)
- validator (for validations)
- jsonwebtoken (for jwt generation and validation)
- uuid (for unique identifiers)
- redis (for storing tokens -as a white list-)
- stringify (for converting objects to string -for saving them to redis-)

#### IdProviderMock Service

#### Logger

#### NotificationService

#### PendingService

#### ReservationData

- mongoose (for mongodb connection, saving reservations db)
- nodemon (for faster/easyer development)
- node-fetch (for requesting the receiver service)

#### ReservationEmitter

#### ReservationProcessor

#### VacQueryTools

#### Auth Service

</br>

## How to Use

**Important note**: When we developed the service, there were two ways in which this application could be run. Rather connecting to the cloud hosted database, or hosting your own database locally, and changing the configuration files of each service in order to look up for your local database. As time went on, the cloud-hosted database is no longer available.

We will detail the instructions in order to run the service using the cloud-hosted database:

1. Create a redis instance `redis-server`
2. Execute `npm install` in all folders that have a `package.json` file, including folders that have the logger as module.
3. Go to `auth_service/config` and rename the file `arq_private.txt` to be called `arq_private.key`. This will later be our private key (We should not be exposing it, we know). [It is saved as txt because git will ignore .key files].
4. Stand at root level and execute `index.js` in a new terminal window for each one of the following folders and in order:
   1. auth_service
   2. AdminService
   3. IdProviderMock
   4. NotificationService
   5. ReservationEmitter
   6. ReservationProcessor

Extra) If you want to use: VacQueryTools or Pending Service, just stand at root level and with a new terminal window inside ReservationData folder execute `node index.js`. If you want to regulate data throughput, you can by changing parameters in method `getReservations` inside the controller of ReservationData.

</br>

## Documentation

An extensive and detailed documentation can be found <a href="./documentation/Arquitectura de Software OBL 1.pdf">here</a>

This pdf explains the following topics:

- Application objective
- Architecture Requirements & Restrictions
- Architecture Design and Documentation
  - "Vista de Asignación"
  - "Vista de módulos"
  - "Vista de usos"
  - "Vista de componentes y conectores"
- Versioning and code quality
- Full detailed Instalation manual
- Team organization
- Arquitectural history
- What could be improved and what we did not do

Application architecture diagram:
<img src="./Resources/img/Arch%20diagram.png" alt="Arch Diagram">

</br>

## FAQ

- If you want to add new features to this project please [see the contribution guide](.github/CONTRIBUTING.md)
- Questions? <a href="mailto:tomasde.angelis17@gmail.com?Subject=Question about University project for subject: Software Architecture" target="_blank">Reach out!</a>
