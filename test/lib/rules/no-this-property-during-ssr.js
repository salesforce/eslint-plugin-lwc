/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-this-property-during-ssr');

const tester = new RuleTester(ESLINT_TEST_CONFIG);

const disallowedProperties = [
    'title',
    'lang',
    'translate',
    'dir',
    'hidden',
    'accessKey',
    'draggable',
    'spellcheck',
    'autocapitalize',
    'contentEditable',
    'enterKeyHint',
    'isContentEditable',
    'inputMode',
    'virtualKeyboardPolicy',
    'offsetParent',
    'offsetTop',
    'offsetLeft',
    'offsetWidth',
    'offsetHeight',
    'innerText',
    'outerText',
    'onbeforexrselect',
    'onabort',
    'onbeforeinput',
    'onblur',
    'oncancel',
    'oncanplay',
    'oncanplaythrough',
    'onchange',
    'onclick',
    'onclose',
    'oncontextlost',
    'oncontextmenu',
    'oncontextrestored',
    'oncuechange',
    'ondblclick',
    'ondrag',
    'ondragend',
    'ondragenter',
    'ondragleave',
    'ondragover',
    'ondragstart',
    'ondrop',
    'ondurationchange',
    'onemptied',
    'onended',
    'onerror',
    'onfocus',
    'onformdata',
    'oninput',
    'oninvalid',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'onload',
    'onloadeddata',
    'onloadedmetadata',
    'onloadstart',
    'onmousedown',
    'onmouseenter',
    'onmouseleave',
    'onmousemove',
    'onmouseout',
    'onmouseover',
    'onmouseup',
    'onmousewheel',
    'onpause',
    'onplay',
    'onplaying',
    'onprogress',
    'onratechange',
    'onreset',
    'onresize',
    'onscroll',
    'onsecuritypolicyviolation',
    'onseeked',
    'onseeking',
    'onselect',
    'onslotchange',
    'onstalled',
    'onsubmit',
    'onsuspend',
    'ontimeupdate',
    'ontoggle',
    'onvolumechange',
    'onwaiting',
    'onwebkitanimationend',
    'onwebkitanimationiteration',
    'onwebkitanimationstart',
    'onwebkittransitionend',
    'onwheel',
    'onauxclick',
    'ongotpointercapture',
    'onlostpointercapture',
    'onpointerdown',
    'onpointermove',
    'onpointerrawupdate',
    'onpointerup',
    'onpointercancel',
    'onpointerover',
    'onpointerout',
    'onpointerenter',
    'onpointerleave',
    'onselectstart',
    'onselectionchange',
    'onanimationend',
    'onanimationiteration',
    'onanimationstart',
    'ontransitionrun',
    'ontransitionstart',
    'ontransitionend',
    'ontransitioncancel',
    'oncopy',
    'oncut',
    'onpaste',
    'dataset',
    'nonce',
    'autofocus',
    'tabIndex',
    'style',
    'attributeStyleMap',
    'attachInternals',
    'blur',
    'click',
    'focus',
    'inert',
    'oncontentvisibilityautostatechange',
    'onbeforematch',
    'namespaceURI',
    'prefix',
    'localName',
    'tagName',
    'id',
    'className',
    'classList',
    'slot',
    'attributes',
    'shadowRoot',
    'part',
    'assignedSlot',
    'innerHTML',
    'outerHTML',
    'scrollTop',
    'scrollLeft',
    'scrollWidth',
    'scrollHeight',
    'clientTop',
    'clientLeft',
    'clientWidth',
    'clientHeight',
    'onbeforecopy',
    'onbeforecut',
    'onbeforepaste',
    'onsearch',
    'elementTiming',
    'onfullscreenchange',
    'onfullscreenerror',
    'onwebkitfullscreenchange',
    'onwebkitfullscreenerror',
    'role',
    'ariaAtomic',
    'ariaAutoComplete',
    'ariaBusy',
    'ariaBrailleLabel',
    'ariaBrailleRoleDescription',
    'ariaChecked',
    'ariaColCount',
    'ariaColIndex',
    'ariaColSpan',
    'ariaCurrent',
    'ariaDescription',
    'ariaDisabled',
    'ariaExpanded',
    'ariaHasPopup',
    'ariaHidden',
    'ariaInvalid',
    'ariaKeyShortcuts',
    'ariaLabel',
    'ariaLevel',
    'ariaLive',
    'ariaModal',
    'ariaMultiLine',
    'ariaMultiSelectable',
    'ariaOrientation',
    'ariaPlaceholder',
    'ariaPosInSet',
    'ariaPressed',
    'ariaReadOnly',
    'ariaRelevant',
    'ariaRequired',
    'ariaRoleDescription',
    'ariaRowCount',
    'ariaRowIndex',
    'ariaRowSpan',
    'ariaSelected',
    'ariaSetSize',
    'ariaSort',
    'ariaValueMax',
    'ariaValueMin',
    'ariaValueNow',
    'ariaValueText',
    'children',
    'firstElementChild',
    'lastElementChild',
    'childElementCount',
    'previousElementSibling',
    'nextElementSibling',
    'after',
    'animate',
    'append',
    'attachShadow',
    'before',
    'closest',
    'computedStyleMap',
    'getAttribute',
    'getAttributeNS',
    'getAttributeNames',
    'getAttributeNode',
    'getAttributeNodeNS',
    'getBoundingClientRect',
    'getClientRects',
    'getElementsByClassName',
    'getElementsByTagName',
    'getElementsByTagNameNS',
    'getInnerHTML',
    'hasAttribute',
    'hasAttributeNS',
    'hasAttributes',
    'hasPointerCapture',
    'insertAdjacentElement',
    'insertAdjacentHTML',
    'insertAdjacentText',
    'matches',
    'prepend',
    'querySelector',
    'querySelectorAll',
    'releasePointerCapture',
    'remove',
    'removeAttribute',
    'removeAttributeNS',
    'removeAttributeNode',
    'replaceChildren',
    'replaceWith',
    'requestFullscreen',
    'requestPointerLock',
    'scroll',
    'scrollBy',
    'scrollIntoView',
    'scrollIntoViewIfNeeded',
    'scrollTo',
    'setAttribute',
    'setAttributeNS',
    'setAttributeNode',
    'setAttributeNodeNS',
    'setPointerCapture',
    'toggleAttribute',
    'webkitMatchesSelector',
    'webkitRequestFullScreen',
    'webkitRequestFullscreen',
    'checkVisibility',
    'getAnimations',
    'setHTML',
    'nodeType',
    'nodeName',
    'baseURI',
    'isConnected',
    'ownerDocument',
    'parentNode',
    'parentElement',
    'childNodes',
    'firstChild',
    'lastChild',
    'previousSibling',
    'nextSibling',
    'nodeValue',
    'textContent',
    'ELEMENT_NODE',
    'ATTRIBUTE_NODE',
    'TEXT_NODE',
    'CDATA_SECTION_NODE',
    'ENTITY_REFERENCE_NODE',
    'ENTITY_NODE',
    'PROCESSING_INSTRUCTION_NODE',
    'COMMENT_NODE',
    'DOCUMENT_NODE',
    'DOCUMENT_TYPE_NODE',
    'DOCUMENT_FRAGMENT_NODE',
    'NOTATION_NODE',
    'DOCUMENT_POSITION_DISCONNECTED',
    'DOCUMENT_POSITION_PRECEDING',
    'DOCUMENT_POSITION_FOLLOWING',
    'DOCUMENT_POSITION_CONTAINS',
    'DOCUMENT_POSITION_CONTAINED_BY',
    'DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC',
    'appendChild',
    'cloneNode',
    'compareDocumentPosition',
    'contains',
    'getRootNode',
    'hasChildNodes',
    'insertBefore',
    'isDefaultNamespace',
    'isEqualNode',
    'isSameNode',
    'lookupNamespaceURI',
    'lookupPrefix',
    'normalize',
    'removeChild',
    'replaceChild',
    'addEventListener',
    'dispatchEvent',
    'removeEventListener',

    'template',
];

tester.run('no-this-property-during-ssr', rule, {
    valid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use this.template here
                  }
                  renderedCallback() {
                    this.template.querySelector('span')?.foo();
                  }
                  bar() {
                    this.template.querySelector('span')?.foo();
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use this.template here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    this.template.querySelector('span')?.foo();
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use this.template here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    doSomething(this.template);
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use this.template here
                  }
                  bar() {
                    doSomething(this.template);
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    if(document !== undefined) {
                      doSomething(this.template);
                    }
                  }
                }
            `,
        },
    ],
    invalid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.template.querySelector('span')?.foo();
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access any DOM properties on `this` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.foo();
                  }
                  foo() {
                    this.template.querySelector('span')?.foo();
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access any DOM properties on `this` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.foo();
                  }
                  foo() {
                    doSomethingWith(this.template);
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access any DOM properties on `this` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    doSomethingWith(this.template);
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access any DOM properties on `this` in methods that will execute during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    this.foo();
                  }
                  renderedCallbac() {
                    this.foo();
                  }
                  foo() {
                    doSomethingWith(this.template);
                  }
                }
            `,
            errors: [
                {
                    message:
                        'You should not access any DOM properties on `this` in methods that will execute during SSR.',
                },
            ],
        },
        ...disallowedProperties.map((property) => ({
            code: `
              import { LightningElement } from 'lwc';
              import tmplA from './a.html';

              export default class Foo extends LightningElement {
                connectedCallback() {
                  this.foo();
                }
                foo() {
                  doSomethingWith(this.${property});
                }
              }
            `,
            errors: [
                {
                    message:
                        'You should not access any DOM properties on `this` in methods that will execute during SSR.',
                },
            ],
        })),
    ],
});
