# URL Monitoring API

## A Simple REST API to monitor websites, and send notifications to users when website availability changes

<p align="center">
    <a href="https://github.com/3omar-mostafa/url_monitor_api/actions/workflows/ci.yml" alt="CI Pipeline">
        <img src="https://github.com/3omar-mostafa/url_monitor_api/actions/workflows/ci.yml/badge.svg" />
    </a>
    <a href="https://documenter.getpostman.com/view/28971351/2s9XxyRtDs" alt="Postman docs">
        <img src="https://img.shields.io/badge/Postman-docs-orange?style=flat&logo=postman&logoColor=white&labelColor=orange" />
    </a>
</p>

---

<p align="center">
<strong>Used Tools & Technologies<strong/><br/><br/>
<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/nestjs-%23E0234E.svg?style=for-the-badge&logo=nestjs&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white" />
<img src="https://img.shields.io/badge/IntelliJ%20IDEA-000000.svg?style=for-the-badge&logo=intellij-idea&logoColor=white" />
<img src="https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white" />
<img src="https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white" />
</p>

---
## Docker

### Dependencies
Application is dockerized, all you need is to have `docker-compose`

### Getting Started
1. Checkout this repository
    ```sh
    git clone https://github.com/3omar-mostafa/url_monitor_api.git
    ```
2. Create `.env` file based on `example.env` template
  
3. Run using docker
    ```sh
    cd url_monitor_api
    docker-compose up -d
    ```

    The above command assumes the environment variables are located in `.env`, to use another file you can use `ENV_FILE`
   
    ```sh
    cd url_monitor_api
    ENV_FILE=prod.env docker-compose up -d --env-file "${ENV_FILE}"
    ```

---

### Dependencies
  - node.js >= 16
  - MongoDB
  
    ```sh
    # Install npm dependencies
    npm install
    ```
  
### Getting Started
1. Checkout this repository
    ```sh
    git clone https://github.com/3omar-mostafa/url_monitor_api.git
    ```
2. Create `.env` file based on `example.env` template

3. Running the app
  
    ```sh
    # development
    npm run start
    ```
    
    ```sh
    # watch mode
    npm run start:dev
    ```
    
    ```sh
    # production mode
    npm run start:prod
    ```

4. Test (Optional)
  
    ```sh
    # unit tests
    npm run test
    ```
    
    ```sh
    # e2e tests
    npm run test:e2e
    ```
    
    ```sh
    # test coverage
    npm run test:cov
    ```

---

## API Documentation

[![Postman docs](https://img.shields.io/badge/Postman-Docs-orange?style=for-the-badge&logo=postman&logoColor=white&labelColor=orange)](https://documenter.getpostman.com/view/28971351/2s9XxyRtDs) 
