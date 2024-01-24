# Welcome to the Butler Platform

## Setup

### .bashrc or .zshrc

```
cd() {
  builtin cd "$@"
  if [[ -f .nvmrc ]]; then
    nvm use > /dev/null
  fi
}
cd .
```


## Documentation

We compiled detailed steps on how to run the platform apps, including helpful resources to understand each and every app in details, coding standards guidelines and more within the docs app.

To start the documentation app, follow below steps.


#### Inside project root directory run:

```
npm install
```

#### Then start the documentation app using the following command:

```
nx serve docs
```

Enjoy reading!
