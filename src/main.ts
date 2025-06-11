import './public-path';
import { enableProdMode, NgModuleRef } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

registerLocaleData(zh);

let app: void | NgModuleRef<AppModule>;
async function render() {
  app = await platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
}

if (!(window as any).__POWERED_BY_QIANKUN__) {
  render();
}

let currentPath = window.location.pathname;
const observer = new MutationObserver(() => {
  const newPath = window.location.pathname;
  if (newPath.startsWith('/bm-dqt') && newPath !== currentPath) {
    currentPath = newPath;
    const root = document.getElementById('dmdqt');
    if (root && root.hasChildNodes()) {
      root.innerHTML = '';
      render();
    }
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

export async function bootstrap(props: Object) {
}

export async function mount(props: Object) {
  render();
}

export async function unmount(props: Object) {
  // @ts-ignore
  app.destroy();
}
