# Integration Testing and SEC's Measurements for WebApp

This repository contains a demo for measuring the Software Energy Consumption (SEC) of components of a simple Web App throught integration tests.
The SEC's measurements will be done using [TLPC-sensor](https://github.com/davidson-consulting/tlpc-sensor).

In this scenario, we will measure the energy consumption of one backend that is used by two frontends: one with [Material](https://material.io/design) installed, the other with plain CSS (no extra components).

The integration are the same for both frontends implemented as a python script using selenium, see: [test.py](./test/test.py)

![demo.gif](./demo.gif)

## Prerequisite

- [npm and NodeJS](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- [Angular](https://angular.io/) (for the frontends)
- [NestJS](https://docs.nestjs.com/) (for the backend)
- port `3000`, `4200` and `4201` to be free of use
- python3
- [selenium](https://selenium-python.readthedocs.io/installation.html) for python3

Please, make sure to follow the README of the three components, namely the [backend](./backend/README.md), [frontend](./frontend/README.md) and the [frontend_no_mat](./frontend_no_mat/README.md).

## Testing

When all the components are installed and running, you can run the tests as follow:

1. Run the backend and both frontends in background in 3 separate terminals:

```sh
$ ng serve &
[1] 1559531
```
```sh
$ ng serve --port 4201 &
[1] 1559429
```

```sh
npm run start &
[1] 1559624
```

2. In a fourth terminal, gather the PIDs and put them in environment variables:

For the frontends, it is straight foward, just get the number that the shell prints on the stdout when you run the frontends in background:

```sh
$ ng serve &
[1] 1559531
...
$ ng serve --port 4201 &
[1] 1559429
...
PID_FRONT=1559531
PID_FRONT_NO_MAT=1559429        
```

For the background, it is a bit trickier since the pid returned by the command is the PID of node, and not the backend process.
To find the correct PID, run the following:

```sh
ps aux | grep backend
user 1559649 72.2  2.0 885436 324628 pts/2   SNl  11:21   0:19 node /home/user/workspace/toy-webapp/backend/node_modules/.bin/nest start
user 1559670  0.0  0.0   2624   536 pts/2    SN   11:21   0:00 /bin/sh -c node /home/user/workspace/toy-webapp/backend/dist/main
user 1559671  9.5  0.7 891396 125784 pts/2   SNl  11:21   0:01 node /home/user/workspace/toy-webapp/backend/dist/main
user 1559770  0.0  0.0   9048   660 pts/2    S+   11:21   0:00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn --exclude-dir=.idea --exclude-dir=.tox backend
```

The process that is interesting for us is the one that runs the following command:

```
node /home/user/workspace/toy-webapp/backend/dist/main
```

In my case:

```
user 1559671  9.5  0.7 891396 125784 pts/2   SNl  11:21   0:01 node /home/user/workspace/toy-webapp/backend/dist/main
```

So the PID is:

```sh
PID_BACK=1559671
```

To sum up, you will have a terminal with the three following variables:

```sh
PID_FRONT=1559531
PID_FRONT_NO_MAT=1559429  
PID_BACK=1559671
```

3. Once it is done, add the `chromedriver` to your path:

```sh
export PATH=${PATH}:/home/benjamin/workspace/toy-webapp/test/webdrivers/
```

4. Run the [TLPC-sensor](https://github.com/davidson-consulting/tlpc-sensor) UDP server in a new terminal:

```sh
cd tlpc-sensor/build
./tlpc-sensor
```

5. Eventually, run the python script `test/test.py` with the proper command-line options:

```sh
python3 test.py ${PID_FRONT} ${PID_FRONT_NO_MAT} ${PID_BACK}
```

6. You should observe something as follow:

```json
{
    "test_signup_mat": {
        "frontend": {
            "RAPL_ENERGY_PKG": 296594964480,
            "INSTRUCTIONS_RETIRED": 78087570,
            "LLC_MISSES": 1653978,
            "CYCLES": 71570116,
            "duration": 57839717
        },
        "backend": {
            "RAPL_ENERGY_PKG": 296551972864,
            "INSTRUCTIONS_RETIRED": 22185041,
            "LLC_MISSES": 924623,
            "CYCLES": 36868305,
            "duration": 17991511
        }
    },
    "test_signup_no_mat": {
        "frontend": {
            "RAPL_ENERGY_PKG": 482186100736,
            "INSTRUCTIONS_RETIRED": 61227821,
            "LLC_MISSES": 1530793,
            "CYCLES": 71326845,
            "duration": 35913654
        },
        "backend": {
            "RAPL_ENERGY_PKG": 482186100736,
            "INSTRUCTIONS_RETIRED": 21502872,
            "LLC_MISSES": 889942,
            "CYCLES": 39302713,
            "duration": 14811585
        }
    }
}
```

Where:

- `RAPL_ENERGY_PKG` is the energy consumtion of the component (&mu;J)
- `INSTRUCTIONS_RETIRED` is the number of instructions (CPU) executed by the component
- `LLC_MISSES` is the number of cache-misses by the component
- `CYCLES` is the number of cycles (CPU) executed by the component
- `duration` is the execution time (ns)
- `backend` is the record for the backend
- `frontend` is the record for frontend either with material (under `test_signup_mat`) either without material (under `test_signup_no_mat`)