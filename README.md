# cumplidos_cliente

El aplicativo tiene la funcionalidad de ser un gestor de los cumplidos de los diferentes contratistas, en dicho aplicativo los contratistas realizan el proceso de subir los documentos respectivos a sus tareas del mes o periodo designado.

El supervisor realizara una revisión detallada de los informes de cada contratista bajo su supervisión, el supervisor en el aplicativo podra devolver documentos para su corrección o aprobarlos.

Seguido de la aprobación del supervisor, el ordenador podrá aprobar los documentos para el respectivo pago del contratista.


### Tecnologías Implementadas y Versiones
* [Angular JS](https://angularjs.org/)
* [Bootstrap 3](https://getbootstrap.com/docs/3.3/)
* [Angular JS generator](https://github.com/fabianLeon/oas)
* [Node.js en la versión estable](https://nodejs.org/en/)

### Variables de Entorno
```shell
# En Pipeline
SLACK_AND_WEBHOOK: WEBHOOK de Slack Grupo ci-covid-serverles
AWS_ACCESS_KEY_ID: llave de acceso ID Usuario AWS
AWS_SECRET_ACCESS_KEY: Secreto de Usuario AWS
```

### Ejecución del Proyecto

instalar paquetes necesarios
```bash
# requerimientos
npm install -g grunt-cli bower yo generator-karma generator-oas
```

Clonar el proyecto del repositorio de git
```bash
# clone the project
git clone https://github.com/udistrital/cumplidos_cliente.git
# enter the project directory
cd cumplidos_cliente
```
Iniciar el servidor en local
```bash
# install dependency
npm install
bower install

# start server
npx ng serve
```

### Ejecución Dockerfile
```bash
# Does not apply
```
### Ejecución docker-compose
```bash
# Does not apply
```
### Ejecución Pruebas

Pruebas unitarias powered by Jest
```bash
# run unit test
npm run test
# Runt linter + unit test
npm run test:ui
```

## Estado CI

| Develop | Relese 0.0.1 | Master |
| -- | -- | -- |
| [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/cumplidos_cliente/status.svg?ref=refs/heads/develop)](https://hubci.portaloas.udistrital.edu.co/udistrital/cumplidos_cliente) | [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/cumplidos_cliente/status.svg?ref=refs/heads/release/0.0.1)](https://hubci.portaloas.udistrital.edu.co/udistrital/cumplidos_cliente) | [![Build Status](https://hubci.portaloas.udistrital.edu.co/api/badges/udistrital/cumplidos_cliente/status.svg)](https://hubci.portaloas.udistrital.edu.co/udistrital/cumplidos_cliente) |

## Licencia

[This file is part of cumplidos_cliente.](LICENSE)

cumplidos_cliente is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (atSara Sampaio your option) any later version.

cumplidos_cliente is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with cumplidos_cliente. If not, see https://www.gnu.org/licenses/.















-----------


### Configuración del proyecto

* Clonar el repositorio:
    ```shell
        git clone https://github.com/udistrital/cumplidos_cliente
    ```
* Instalar yo, grunt, bower y generator- karma y generator-oas
    ```shell
        npm install -g grunt-cli bower yo generator-karma generator-oas
    ```
* Instalar dependencias
    ```shell
        npm install
    ```
    ```shell
        bower install
    ```


### Ejecución del proyecto

Para ejcutar el proyecto localmente se debe verificar en el archivo “config.js”, ubicado en la carpeta app/scripts/services/, que las apis estén correactamente configuradas y que estén deplegadas.

**conf_local**:
```
angular.module('contractualClienteApp')
    .constant('CONF', {
        GENERAL: conf_pruebas
    });

```
Ahora se puede correr el api de la siguiente manera:
    ```
        grunt serve
    ```

Para crear el build de la aplicación:
    ```
        grunt build
    ```

El cliente se depliega en el puerto [9000](http://localhost:9000).

### Pruebas unitaras

La pruebas se relizan con [karma](https://karma-runner.github.io/latest/index.html), ejecutar el comando:
    ```
        grunt test
    ```


## Licencia

This file is part of cumplidos-cliente.

cumplidos-cliente is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

Foobar is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with Foobar. If not, see https://www.gnu.org/licenses/.
