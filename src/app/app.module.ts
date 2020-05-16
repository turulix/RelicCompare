import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {RelicCompareComponent} from './#components/relic-compare/relic-compare.component';
import {RouterModule, Routes} from '@angular/router';
import {RelicSearchBarComponent} from './#components/#subcomp/relic-search-bar/relic-search-bar.component';
import {CacheService} from './#service/cache.service';

const appRoutes: Routes = [
    {
        path: '',
        component: RelicCompareComponent
    },
    {
        path: "**",
        redirectTo: "/"
    }
];

@NgModule({
    declarations: [
        AppComponent,
        RelicCompareComponent,
        RelicSearchBarComponent
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
