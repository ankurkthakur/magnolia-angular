import { Component, Input, AfterContentInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
    selector: 'app-navigation',
    templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterContentInit {
    navItems: object;
    @Input() content: object;
    constructor(private router: Router) {}

    async fetchNav(): Promise<Array<Object>> {
        const url = environment.navUrl + environment.appBase;
        console.log('NAV URL:' + url);
        const response = await fetch(url);
        const data = await response.json();
        return data;
    }

    ngAfterContentInit(): void {
        
        if (!this.navItems) {
            this.fetchNav().then(data => {
                let items = data['@nodes'].map(nodeName => {return data[nodeName]})
                this.navItems = [data, ...items];
            });
        }
    }

    getLink(item: object): string {
        const path = this.getRelativePath(item['@path']);
        return `${path.endsWith('/') ? path : `${path.substr(0, path.length)}.html`}`;
    }

    isActive(item: object): boolean {
        const path = this.getRelativePath(item['@path']);
        let { url } = this.router;
        url = url.replace(/\.html.*$/, '');
        url = url === '' ? '/' : url;
        return url === path;
    }

    getRelativePath(path: string): string {
        const relativePath = path.substring(environment.appBase.length);
        return relativePath === '' ? '/' : relativePath;
    }

}
