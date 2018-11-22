
import { T, now } from "./modules/timeline-monad";

const _target = document
  .querySelector('#target');
const target = _target == null
  ? <Element>{}
  : _target;

const _sce = document.scrollingElement;
const sce = _sce == null
  ? <Element>{}
  : _sce;

const consoleTL = ((console) => T(
  (self: timeline) => self.sync((a: unknown) => {
    console.log(a);
    return a;
  })
))(console);
const log = (a: unknown) => (consoleTL[now] = a)

interface timeline {
  type: string;
  [now: string]: any;
  sync: Function;
}

interface dir_name {
  dir: string;
  name: string;
}
interface data {
  text: string;
  dir_name: dir_name;
  line: number;
  lines: number;
}

const linesMappingTL = T();

const asciidoctor = require('asciidoctor.js')();
const registry = asciidoctor.Extensions.create();

import { linemap } from './ext';
linemap(registry)(linesMappingTL);
/*
import('../extensions/highlight.js/index.js')
  .then((module: any) => {

    module.register(registry);

  });
*/

const headElTL = T();
headElTL[now] =
  document
    .getElementsByTagName("head")[0];

let count = 0;
const render = ((linesMappingTL: timeline) =>
  (dataTL: timeline) =>
    (baseOption: object) =>
      (f: Function) => {

        console.log(count++);

        //renderDone
        //f();


        const data = dataTL[now];
        const addOption =
        {
          base_dir: data.dir_name.dir,
          extension_registry: registry,
          sourcemap: true,
        };

        const option =//destructive for {}
          Object.assign({}, baseOption, addOption);

        const html = asciidoctor
          .convert(data.text, option);

        //---------get html
        const parser = new DOMParser()
        const htmlEl = parser
          .parseFromString(html, "text/html");

        consoleTL[now] = htmlEl;

        //---------get head
        const headEl = htmlEl
          .getElementsByTagName("head")[0];
        const headTargetEl = document
          .getElementsByTagName("head")[0];
        consoleTL[now] = headEl;


        console.log(
          headEl.isEqualNode(headElTL[now] as HTMLBaseElement)
        );

        headElTL[now] = headEl;

        const headChildlenEls = Array.prototype
          .slice.call(headEl.children);
        /* 
             headChildlenEls.map((el: HTMLBodyElement) =>
               headTargetEl
                 .insertAdjacentElement("beforeend", el)
             );
            
                //---------get body
                const bodyEl = htmlEl
                  .getElementsByTagName("body")[0];
                const bodyTargetEl = document
                  .getElementsByTagName("body")[0];
                consoleTL[now] = "bodyEl";
                consoleTL[now] = bodyEl;
          
                const bodyChildlenEls = Array.prototype
                  .slice.call(bodyEl.children);
          
                consoleTL[now] = bodyChildlenEls;
          
                const bodyContentsEls = bodyChildlenEls
                  .filter((el: HTMLBodyElement) =>
                    (el.tagName !== "SCRIPT")
                  );
          
                consoleTL[now] = "bodyContentsEls";
                consoleTL[now] = bodyContentsEls;
          
                bodyContentsEls.map((el: HTMLBodyElement) =>
                  bodyTargetEl
                    .insertAdjacentElement("beforeend", el)
                );
          
          */

        consoleTL[now] = data.dir_name.dir;
        consoleTL[now] = data.dir_name.name;

        const line = (line =>
          linesMappingTL[now]
            .reduce((acm: number, current: number) =>
              (line >= current)
                ? current
                : acm
            ))(data.line + 1);

        const className = (data.line < 10)
          ? "target"
          : "data-asciidocline" + line;

        const _targetElement = document
          .getElementsByClassName(className)[0];
        const targetElement = _targetElement == null
          ? <Element>{}
          : _targetElement;

        targetElement.scrollIntoView();

        const offset = 150;

        ((window.innerHeight + window.scrollY) >= document.body.offsetHeight)//touch the bottom
          ? undefined
          : sce.scrollTop = sce.scrollTop - offset;


        return true;
      })(linesMappingTL);

export { render };

