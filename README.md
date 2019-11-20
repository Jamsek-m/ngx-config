# @mjamsek/ngx-config
![Build Status](https://jenkins.mjamsek.com/buildStatus/icon?job=ngx-config-lib)
> Library for runtime configuration of Angular applications

## Introduction

## Documentation

### Installation

To install library simply execute command:

```bash
npm install --save @mjamsek/ngx-config
```

### Usage

#### Initialization

Library's initialization method must be called at application startup, preferably, before any other code.

Two recommended ways:

* Register Angular application initializer (recommended - the Angular way)
* In `main.ts` file to wrap around Angular's bootstrap function

##### Application initializer

First, we will need to write factory function, which will call initialization method. For this we can create new file called `factories.ts` and put this code in it:

```typescript
import {ConfigService} from "@mjamsek/ngx-config";
import {environment} from "../environments/environment";

export function AppConfigFactory() {
    return async () => {
        await ConfigService.initialize("/config/config.json", environment);
    };
}
```

Next we need to let Angular know, to use this factory when initializing application. We can do this in `app.module.ts`:

```typescript
import {APP_INITIALIZER, NgModule} from "@angular/core";
import {AppConfigFactory} from "./factories";

@NgModule({
    declarations: [],
    imports: [],
    providers: [
        {provide: APP_INITIALIZER, useFactory: AppConfigFactory, multi: true}
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

##### Wrapping method

In file `main.ts`, bootstrap Angular method with own:

```typescript
import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";
import { ConfigService } from "@mjamsek/ngx-config";

if (environment.production) {
    enableProdMode();
}
ConfigService.initialize({path: "/config/config.json", environment: environment}).then(() => {
    platformBrowserDynamic().bootstrapModule(AppModule)
        .catch(err => console.error(err));
});
```

#### Using configuration values

Suppose our initialized configuration looks like this:

```json
{
  "api": "https://....",
  "version": "v1",
  "auth": {
    "clientId": "client123"
  }
}
```

Such values can be accessed in two ways:

##### getConfig()

Method `getConfig<E>()` returns object with same structure as environment object. It can be accessed normally.

```typescript
import { ConfigService } from "@mjamsek/ngx-config";

const api = ConfigService.getConfig<AppEnv>().api;
const clientId = ConfigService.getConfig<AppEnv>().auth.clientId;
```

Using generic type `E` is optional, but utilizing it, enables better editors to provide intellisense.

##### getValue(key: string)

Method `getValue(key: string)` returns value from environment object. Nested values can be accessed with dot separated keys.

```typescript
import { ConfigService } from "@mjamsek/ngx-config";

const api = ConfigService.getValue("api");
const clientId = ConfigService.getValue("auth.clientId");
```

##### Recommended usage

It is recommended however, that you do not invoke those methods directly in code, but that you instead use dependency injector provided by Angular.

To do this, we first need to define factory for such value:

```typescript
import { ConfigService } from "@mjamsek/ngx-config";

export function ClientIdFactory() {
    return ConfigService.getValue("auth.clientId");
}
```

And then we register this factory as value provider in Angular DI:

```typescript
// app.module.ts
providers: [
    {provide: "clientId", useFactory: ClientIdFactory, multi: false}
]
```

This is same location where we previously put `APP_INITIALIZER` factory.

To use this injected value, simply put this code in constructor of your component/service:

```typescript
@Injectable({
    providedIn: "root"
})
export class MyService {
  constructor(@Inject("clientId") private clientId: string) { }
}
```
