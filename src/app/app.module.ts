import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {MainpageComponent} from './#components/mainpage/mainpage.component';
import {RouterModule, Routes} from '@angular/router';
import {SearchBarComponent} from './#components/#subcomp/search-bar/search-bar.component';
import {CacheService} from './#service/cache.service';

const appRoutes: Routes = [
    {
        path: '',
        component: MainpageComponent
    },
    {
        path: "**",
        redirectTo: "/"
    }
];

@NgModule({
    declarations: [
        AppComponent,
        MainpageComponent,
        SearchBarComponent
    ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(
            appRoutes
        ),
    ],
    providers: [CacheService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
