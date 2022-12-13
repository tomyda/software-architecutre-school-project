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

## Key Services with features

#### Admin Service

Service in charge of activities that need authentication, such as:

- Creating vaccination centers
- Keeping track of vaccination centers appointments
- Managing system validations and endpoints
- User Sessions (Admins & Healthcare professionals)
- Marking people as vaccinated
- Querying people's vaccination status
  Healthcare professionals also access this service to mark a person as vaccinaated. When new appointments are created, the service equeues in "Quota Updated Queue" and those will be consumed by the Pending Service. This service will assign pending reservations to new appointments.

#### Auth Service

Service in charge of authentication and authorization. It is used by all other services to validate the user's identity and permissions. It also provides a JWT token to be used by the other services.

It has no exposed endpoints. It is only used by other services in the inside network.

- Generates JWT tokens
- Validates JWT tokens
- Revokes JWT tokens

#### Logger

The logger is responsible for logging informative and error logs and adding them to the combined.log and error.log files, respectively. We decided to include the logger as an external library to interfere as little as possible with the code of the applications. To use it, you simply have to run "npm i" inside the logger folder and you will already have two implementations ready to use. New implementations can be easily added by extending the AbstractLogger class and choosing it as the implementation in the configuration file. By implementing the logger in this way, we are fulfilling Req #5, which establishes that the solution must have the possibility of changing the specific tools or libraries used to produce information about failure and error management with the lowest possible cost. If in the future we want to implement the other modules in a different way, they will not be impacted, only the Logger itself is modified.

#### NotificationService

This is the service responsible for notifying users. It will notify users according to the settings configured in the AdminService (sms, whatsapp, email, etc.).

#### PendingService

This is the service responsible for processing new spots for existing vaccination centers in order to try to schedule reservations on the waiting list and assign them a vaccination center.

#### ReservationEmitter

This is the service in charge of consuming validated reservations from the queues of accepted and pending reservations.

- It stores these reservations in the database.
- It is responsible for allowing users to cancel a reservation or check the status of their reservation.

#### ReservationProcessor

Service in charge of receiving and processing vaccination reservations.

- When a reservation request arrives, it is responsible for performing the corresponding validations and transformations.
- It looks for an assignable vaccination center based on the determined criteria.
  - If it finds a vaccination center for the reservation, it subtracts one spot from the vaccination center and adds the reservation to the queue of accepted reservations.
  - If it does not find a vaccination center, it adds the reservation to the queue of pending reservations to wait for new spots.
  - The Reservation Emitter Service will consume both queues to continue. This service also exposes an endpoint that allows users with the necessary privileges (through the AdminService) to know the existing validations and transformations.

#### VacQueryTools

This is the service that the media, the public, or system administrators access to make inquiries about the vaccination process.

</br>

## Databases & Persisting Structures

#### Admin Service

This is the database responsible for storing data related to system settings. It stores:

- The history of spots that have been assigned to vaccination centers
- Users who need authentication (administrators, vaccinators)
- Vaccination centers
- The corresponding validations and transformations for the country
- Third-party endpoints to be used (notifications, validation against the identification provider, etc.)

#### Reservations Database

This is the database responsible for storing user reservations. It stores both pending and completed reservations.

#### Quota Update Queue

This is the queue where new available spots for vaccination centers added from the Admin Service are added. This queue is consumed by the Pending service, which will try to assign pending reservations to these new spots.

#### Accepted Reservations Queue

This is the queue where reservations that have been accepted by the Reservation Processor Service are added. This queue is consumed by the Reservation Emitter Service, which will store the reservations in the database and allow users to check their status.

#### Pending Reservations Queue

This is the queue where pending reservations (those for which no vaccination center was found) are added. These reservations must be persisted as pending in the Reservation Database by the Reservation Emitter (the service that consumes the queue).

#### Whitelisted tokens redis

This is the redis database where the tokens that have been validated by the Auth Service are stored. This is used to validate the user's identity and permissions.

</br>

## Dependencies

- uuid (used for generating vaccination center uuid -"code"-)
- generate-password (used for generating admins random, secure, password)
- bcryptjs (used for hashing user password -for security-)
- validator (used for validating email structurally)
- express (for server)
- mongoose (for mongodb connection)
- nodemon (for faster/easyer development)
- jsonwebtoken (for jwt generation and validation)
- redis (for storing tokens -as a white list-)
- stringify (for converting objects to string -for saving them to redis-)
- node-fetch (for requesting the receiver service)

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
