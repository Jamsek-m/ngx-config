# @mjamsek/ngx-config
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
