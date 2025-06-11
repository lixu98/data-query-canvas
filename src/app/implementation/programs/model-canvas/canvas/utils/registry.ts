import { Injector, TemplateRef, Type } from '@angular/core';
import { Graph, Node } from '@antv/x6';
import * as AngularGraph from '@antv/x6-angular-shape';

export type Content = TemplateRef<any> | Type<any>;

export type AngularShapeConfig = Node.Properties & {
  shape: string;
  injector: Injector;
  content: Content;
  componentFactoryResolver: any;
};

export const registerInfo: Map<
  string,
  {
    injector: Injector;
    content: Content;
    componentFactoryResolver: any;
  }
> = new Map();

export function register(config: AngularShapeConfig) {
  const { shape, injector, content, componentFactoryResolver, ...others } = config;
  registerInfo.set(shape, { injector, content, componentFactoryResolver });

  // @ts-ignore
  AngularGraph.register({
    shape,
    inherit: 'angular-shape',
    ...others
  });
}
