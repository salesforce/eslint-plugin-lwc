/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * SPDX-License-Identifier: MIT
 * For full license text, see the LICENSE file in the repo root or https://opensource.org/licenses/MIT
 */
'use strict';
const { RuleTester } = require('eslint');

const { ESLINT_TEST_CONFIG } = require('../shared');
const rule = require('../../../lib/rules/no-restricted-browser-globals-during-ssr');

const tester = new RuleTester(ESLINT_TEST_CONFIG);

tester.run('no-browser-globals-during-ssr', rule, {
    valid: [
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use window here
                  }
                  renderedCallback() {
                    window.foo = true;
                  }
                  bar() {
                    this.template.classList.add('foo');
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
                    // we can't use window here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    window.foo = true;
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
                    // we can't use window here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    doSomething(window);
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
                    // we can't use window here
                  }
                  bar() {
                    doSomething(window);
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                function notInvokedDuringSSR() {
                  window.futzAround();
                }

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use window here
                  }
                  bar() {
                    notInvokedDuringSSR();
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                function notInvokedDuringSSR() {
                  window.futzAround();
                }

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use window here
                  }
                  renderedCallback() {
                    notInvokedDuringSSR();
                  }
                }
            `,
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                function notInvokedDuringSSR() {
                  window.futzAround();
                }

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use window here
                  }
                  renderedCallback() {
                    this.bar();
                  }
                  bar() {
                    notInvokedDuringSSR();
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
                    window.x = 1;
                  }
                }
              }
          `,
        },
        { code: `const f = new Foo();` },
    ],
    invalid: [
        {
            code: `
                import { LightningElement } from 'lwc';

                document.futzAround();

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                }
            `,
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                {
                  document.futzAround();
                }
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                }
            `,
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                for (const thing of things) {
                  document.futzAround(thing);
                }

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    // we can't use document here
                  }
                }
            `,
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                function writer() {
                  document.write("Hello world")
                };
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    writer();
                  }
                }
            `,
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                const writer = function() {
                  document.write("Hello world")
                };
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    writer();
                  }
                }
            `,
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';

                const writer = () => {
                  document.write("Hello world")
                };
                export default class Foo extends LightningElement {
                  connectedCallback() {
                    writer();
                  }
                }
            `,
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    window.foo = true;
                  }
                }
            `,
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
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
                    window.bar = true;
                  }
                }
            `,
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
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
                    doSomethingWith(window);
                  }
                }
            `,
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: `
                import { LightningElement } from 'lwc';
                import tmplA from './a.html';

                export default class Foo extends LightningElement {
                  connectedCallback() {
                    doSomethingWith(window);
                  }
                }
            `,
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AbstractRange()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AnalyserNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Animation()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AnimationEffect()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AnimationEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AnimationPlaybackEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AnimationTimeline()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Attr()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Audio()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AudioBuffer()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AudioBufferSourceNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AudioContext()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AudioData()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AudioDestinationNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AudioListener()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AudioNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AudioParam()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AudioParamMap()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AudioProcessingEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AudioScheduledSourceNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new AudioWorkletNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new BackgroundFetchManager()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new BackgroundFetchRecord()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new BackgroundFetchRegistration()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new BarProp()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new BaseAudioContext()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new BeforeInstallPromptEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new BeforeUnloadEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new BiquadFilterNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Blob()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new BlobEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new BluetoothUUID()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new BroadcastChannel()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new BrowserCaptureMediaStreamTrack()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ByteLengthQueuingStrategy()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CDATASection()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSS()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSAnimation()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSConditionRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSContainerRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSCounterStyleRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSFontFaceRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSFontPaletteValuesRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSGroupingRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSImageValue()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSImportRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSKeyframeRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSKeyframesRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSKeywordValue()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSLayerBlockRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSLayerStatementRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSMathClamp()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSMathInvert()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSMathMax()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSMathMin()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSMathNegate()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSMathProduct()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSMathSum()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSMathValue()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSMatrixComponent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSMediaRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSNamespaceRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSNumericArray()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSNumericValue()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSPageRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSPerspective()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSPositionValue()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSPropertyRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSRotate()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSRuleList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSScale()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSSkew()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSSkewX()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSSkewY()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSStyleDeclaration()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSStyleRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSStyleSheet()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSStyleValue()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSSupportsRule()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSTransformComponent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSTransformValue()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSTransition()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSTranslate()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSUnitValue()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSUnparsedValue()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CSSVariableReferenceValue()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CanvasCaptureMediaStreamTrack()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CanvasFilter()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CanvasGradient()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CanvasPattern()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CanvasRenderingContext2D()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ChannelMergerNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ChannelSplitterNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CharacterData()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ClipboardEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CloseEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Comment()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CompositionEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CompressionStream()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ConstantSourceNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ContentVisibilityAutoStateChangeEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ConvolverNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CountQueuingStrategy()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CropTarget()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Crypto()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CustomElementRegistry()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CustomEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new CustomStateSet()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMError()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMException()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMImplementation()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMMatrix()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMMatrixReadOnly()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMParser()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMPoint()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMPointReadOnly()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMQuad()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMRect()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMRectList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMRectReadOnly()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMStringList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMStringMap()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DOMTokenList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DataTransfer()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DataTransferItem()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DataTransferItemList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DecompressionStream()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DelayNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DelegatedInkTrailPresenter()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Document()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DocumentFragment()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DocumentTimeline()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DocumentType()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DragEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new DynamicsCompressorNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Element()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ElementInternals()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new EncodedAudioChunk()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new EncodedVideoChunk()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ErrorEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new EventCounts()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new EventSource()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new External()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new FeaturePolicy()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new File()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new FileList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new FileReader()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new FocusEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new FontFace()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new FontFaceSetLoadEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new FormData()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new FormDataEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new FragmentDirective()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new GainNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Gamepad()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new GamepadButton()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new GamepadEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new GamepadHapticActuator()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Geolocation()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new GeolocationCoordinates()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new GeolocationPosition()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new GeolocationPositionError()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLAllCollection()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLAnchorElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLAreaElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLAudioElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLBRElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLBaseElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLBodyElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLButtonElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLCanvasElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLCollection()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLDListElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLDataElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLDataListElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLDetailsElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLDialogElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLDirectoryElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLDivElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLDocument()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLEmbedElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLFieldSetElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLFontElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLFormControlsCollection()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLFormElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLFrameElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLFrameSetElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLHRElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLHeadElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLHeadingElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLHtmlElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLIFrameElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLImageElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLInputElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLLIElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLLabelElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLLegendElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLLinkElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLMapElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLMarqueeElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLMediaElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLMenuElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLMetaElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLMeterElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLModElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLOListElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLObjectElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLOptGroupElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLOptionElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLOptionsCollection()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLOutputElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLParagraphElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLParamElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLPictureElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLPreElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLProgressElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLQuoteElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLScriptElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLSelectElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLSlotElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLSourceElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLSpanElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLStyleElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLTableCaptionElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLTableCellElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLTableColElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLTableElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLTableRowElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLTableSectionElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLTemplateElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLTextAreaElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLTimeElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLTitleElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLTrackElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLUListElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLUnknownElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HTMLVideoElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HashChangeEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Headers()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Highlight()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new HighlightRegistry()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new History()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IDBCursor()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IDBCursorWithValue()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IDBDatabase()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IDBFactory()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IDBIndex()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IDBKeyRange()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IDBObjectStore()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IDBOpenDBRequest()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IDBRequest()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IDBTransaction()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IDBVersionChangeEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IIRFilterNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IdleDeadline()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Image()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ImageBitmap()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ImageBitmapRenderingContext()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ImageCapture()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ImageData()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ImageTrack()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ImageTrackList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Ink()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new InputDeviceCapabilities()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new InputDeviceInfo()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new InputEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IntersectionObserver()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new IntersectionObserverEntry()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new KeyboardEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new KeyframeEffect()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new LargestContentfulPaint()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new LaunchParams()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new LaunchQueue()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new LayoutShift()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new LayoutShiftAttribution()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Location()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaCapabilities()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaElementAudioSourceNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaEncryptedEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaError()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaMetadata()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaQueryList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaQueryListEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaRecorder()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaSession()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaSource()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaSourceHandle()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaStream()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaStreamAudioDestinationNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaStreamAudioSourceNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaStreamEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaStreamTrack()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaStreamTrackEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaStreamTrackGenerator()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MediaStreamTrackProcessor()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MimeType()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MimeTypeArray()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MouseEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MutationEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MutationObserver()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new MutationRecord()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new NamedNodeMap()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new NavigateEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Navigation()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new NavigationCurrentEntryChangeEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new NavigationDestination()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new NavigationHistoryEntry()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new NavigationTransition()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Navigator()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new NavigatorUAData()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new NetworkInformation()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Node()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new NodeFilter()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new NodeIterator()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new NodeList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Notification()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new OfflineAudioCompletionEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new OfflineAudioContext()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new OffscreenCanvas()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new OffscreenCanvasRenderingContext2D()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Option()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new OscillatorNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new OverconstrainedError()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PageTransitionEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PannerNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Path2D()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PaymentInstruments()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PaymentManager()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PaymentRequestUpdateEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Performance()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PerformanceElementTiming()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PerformanceEntry()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PerformanceEventTiming()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PerformanceLongTaskTiming()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PerformanceMark()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PerformanceMeasure()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PerformanceNavigation()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PerformanceNavigationTiming()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PerformanceObserver()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PerformanceObserverEntryList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PerformancePaintTiming()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PerformanceResourceTiming()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PerformanceServerTiming()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PerformanceTiming()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PeriodicSyncManager()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PeriodicWave()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PermissionStatus()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Permissions()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PictureInPictureEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PictureInPictureWindow()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Plugin()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PluginArray()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PointerEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PopStateEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ProcessingInstruction()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Profiler()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ProgressEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PromiseRejectionEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PushManager()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PushSubscription()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new PushSubscriptionOptions()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCCertificate()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCDTMFSender()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCDTMFToneChangeEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCDataChannel()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCDataChannelEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCDtlsTransport()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCEncodedAudioFrame()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCEncodedVideoFrame()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCError()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCErrorEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCIceCandidate()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCIceTransport()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCPeerConnection()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCPeerConnectionIceErrorEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCPeerConnectionIceEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCRtpReceiver()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCRtpSender()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCRtpTransceiver()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCSctpTransport()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCSessionDescription()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCStatsReport()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RTCTrackEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RadioNodeList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Range()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ReadableByteStreamController()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ReadableStream()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ReadableStreamBYOBReader()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ReadableStreamBYOBRequest()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ReadableStreamDefaultController()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ReadableStreamDefaultReader()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new RemotePlayback()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ReportingObserver()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Request()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ResizeObserver()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ResizeObserverEntry()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ResizeObserverSize()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Response()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAngle()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimateElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimateMotionElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimateTransformElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimatedAngle()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimatedBoolean()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimatedEnumeration()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimatedInteger()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimatedLength()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimatedLengthList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimatedNumber()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimatedNumberList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimatedPreserveAspectRatio()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimatedRect()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimatedString()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimatedTransformList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGAnimationElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGCircleElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGClipPathElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGComponentTransferFunctionElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGDefsElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGDescElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGEllipseElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEBlendElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEColorMatrixElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEComponentTransferElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFECompositeElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEConvolveMatrixElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEDiffuseLightingElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEDisplacementMapElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEDistantLightElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEDropShadowElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEFloodElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEFuncAElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEFuncBElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEFuncGElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEFuncRElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEGaussianBlurElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEImageElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEMergeElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEMergeNodeElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEMorphologyElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEOffsetElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFEPointLightElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFESpecularLightingElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFESpotLightElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFETileElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFETurbulenceElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGFilterElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGForeignObjectElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGGElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGGeometryElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGGradientElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGGraphicsElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGImageElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGLength()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGLengthList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGLineElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGLinearGradientElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGMPathElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGMarkerElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGMaskElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGMatrix()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGMetadataElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGNumber()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGNumberList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGPathElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGPatternElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGPoint()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGPointList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGPolygonElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGPolylineElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGPreserveAspectRatio()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGRadialGradientElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGRect()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGRectElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGSVGElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGScriptElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGSetElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGStopElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGStringList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGStyleElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGSwitchElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGSymbolElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGTSpanElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGTextContentElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGTextElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGTextPathElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGTextPositioningElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGTitleElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGTransform()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGTransformList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGUnitTypes()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGUseElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SVGViewElement()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Scheduler()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Scheduling()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Screen()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ScreenOrientation()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ScriptProcessorNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SecurityPolicyViolationEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Selection()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ShadowRoot()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SharedWorker()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SourceBuffer()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SourceBufferList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SpeechSynthesisErrorEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SpeechSynthesisEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SpeechSynthesisUtterance()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new StaticRange()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new StereoPannerNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Storage()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new StorageEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new StylePropertyMap()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new StylePropertyMapReadOnly()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new StyleSheet()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new StyleSheetList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SubmitEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new SyncManager()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TaskAttributionTiming()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TaskController()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TaskPriorityChangeEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TaskSignal()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Text()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TextDecoderStream()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TextEncoderStream()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TextEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TextMetrics()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TextTrack()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TextTrackCue()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TextTrackCueList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TextTrackList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TimeRanges()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Touch()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TouchEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TouchList()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TrackEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TransformStream()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TransformStreamDefaultController()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TransitionEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TreeWalker()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TrustedHTML()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TrustedScript()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TrustedScriptURL()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TrustedTypePolicy()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new TrustedTypePolicyFactory()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new UIEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new URLPattern()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new UserActivation()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new VTTCue()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new ValidityState()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new VideoColorSpace()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new VideoFrame()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new VideoPlaybackQuality()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new VirtualKeyboardGeometryChangeEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new VisualViewport()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WaveShaperNode()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGL2RenderingContext()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLActiveInfo()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLBuffer()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLContextEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLFramebuffer()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLProgram()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLQuery()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLRenderbuffer()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLRenderingContext()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLSampler()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLShader()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLShaderPrecisionFormat()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLSync()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLTexture()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLTransformFeedback()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLUniformLocation()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebGLVertexArrayObject()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebKitCSSMatrix()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebKitMutationObserver()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WebSocket()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WheelEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Window()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WindowControlsOverlay()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WindowControlsOverlayGeometryChangeEvent()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new Worker()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WritableStream()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WritableStreamDefaultController()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new WritableStreamDefaultWriter()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new XMLDocument()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new XMLHttpRequest()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new XMLHttpRequestEventTarget()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new XMLHttpRequestUpload()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new XMLSerializer()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new XPathEvaluator()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new XPathExpression()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new XPathResult()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'const foo = new XSLTProcessor()',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(alert);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(blur);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(cancelAnimationFrame);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(cancelIdleCallback);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(captureEvents);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(chrome);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(clientInformation);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(confirm);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(createImageBitmap);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(crossOriginIsolated);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(customElements);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(devicePixelRatio);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(frameElement);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(frames);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(getComputedStyle);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(getSelection);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(history);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(indexedDB);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(innerHeight);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(innerWidth);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(isSecureContext);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(launchQueue);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(localStorage);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(location);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(locationbar);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(matchMedia);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(menubar);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(moveBy);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(moveTo);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(navigation);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(navigator);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(offscreenBuffering);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onabort);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onafterprint);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onanimationend);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onanimationiteration);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onanimationstart);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onappinstalled);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onauxclick);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onbeforeinput);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onbeforeinstallprompt);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onbeforematch);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onbeforeprint);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onbeforeunload);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onbeforexrselect);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onblur);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(oncancel);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(oncanplay);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(oncanplaythrough);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onchange);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onclick);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onclose);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(oncontentvisibilityautostatechange);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(oncontextlost);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(oncontextmenu);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(oncontextrestored);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(oncuechange);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ondblclick);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ondrag);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ondragend);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ondragenter);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ondragleave);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ondragover);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ondragstart);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ondrop);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ondurationchange);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onemptied);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onended);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onerror);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onfocus);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onformdata);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ongotpointercapture);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onhashchange);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(oninput);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(oninvalid);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onkeydown);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onkeypress);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onkeyup);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onlanguagechange);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onload);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onloadeddata);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onloadedmetadata);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onloadstart);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onlostpointercapture);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onmessage);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onmessageerror);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onmousedown);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onmouseenter);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onmouseleave);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onmousemove);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onmouseout);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onmouseover);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onmouseup);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onmousewheel);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onoffline);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ononline);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onpagehide);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onpageshow);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onpause);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onplay);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onplaying);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onpointercancel);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onpointerdown);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onpointerenter);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onpointerleave);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onpointermove);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onpointerout);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onpointerover);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onpointerrawupdate);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onpointerup);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onpopstate);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onprogress);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onratechange);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onrejectionhandled);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onreset);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onresize);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onscroll);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onsearch);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onsecuritypolicyviolation);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onseeked);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onseeking);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onselect);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onselectionchange);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onselectstart);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onslotchange);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onstalled);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onstorage);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onsubmit);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onsuspend);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ontimeupdate);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ontoggle);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ontransitioncancel);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ontransitionend);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ontransitionrun);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(ontransitionstart);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onunhandledrejection);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onunload);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onvolumechange);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onwaiting);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onwebkitanimationend);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onwebkitanimationiteration);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onwebkitanimationstart);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onwebkittransitionend);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(onwheel);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(open);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(openDatabase);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(opener);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(origin);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(originAgentCluster);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(outerHeight);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(outerWidth);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(pageXOffset);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(pageYOffset);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(personalbar);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(postMessage);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(print);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(prompt);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(releaseEvents);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(reportError);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(requestAnimationFrame);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(requestIdleCallback);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(resizeBy);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(resizeTo);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(scheduler);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(screen);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(screenLeft);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(screenTop);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(screenX);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(screenY);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(scroll);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(scrollBy);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(scrollTo);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(scrollX);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(scrollY);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(scrollbars);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(sessionStorage);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(speechSynthesis);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(status);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(statusbar);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(stop);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(structuredClone);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(styleMedia);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(toolbar);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(tracePrototypeChainOf);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(trustedTypes);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(visualViewport);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(webkitCancelAnimationFrame);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(webkitMediaStream);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(webkitRTCPeerConnection);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(webkitRequestAnimationFrame);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(webkitRequestFileSystem);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(webkitResolveLocalFileSystemURL);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(webkitSpeechGrammar);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(webkitSpeechGrammarList);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(webkitSpeechRecognition);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(webkitSpeechRecognitionError);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(webkitSpeechRecognitionEvent);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(webkitStorageInfo);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(webkitURL);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(window);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
        {
            code: 'onlyValidInTheBrowser(document);',
            errors: [
                {
                    message: 'Most browser APIs are not accessible during SSR.',
                },
            ],
        },
    ],
});
