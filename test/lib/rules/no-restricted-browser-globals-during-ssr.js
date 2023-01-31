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

const classes = [
    'AbstractRange',
    'AnalyserNode',
    'Animation',
    'AnimationEffect',
    'AnimationEvent',
    'AnimationPlaybackEvent',
    'AnimationTimeline',
    'Attr',
    'Audio',
    'AudioBuffer',
    'AudioBufferSourceNode',
    'AudioContext',
    'AudioData',
    'AudioDestinationNode',
    'AudioListener',
    'AudioNode',
    'AudioParam',
    'AudioParamMap',
    'AudioProcessingEvent',
    'AudioScheduledSourceNode',
    'AudioWorkletNode',
    'BackgroundFetchManager',
    'BackgroundFetchRecord',
    'BackgroundFetchRegistration',
    'BarProp',
    'BaseAudioContext',
    'BeforeInstallPromptEvent',
    'BeforeUnloadEvent',
    'BiquadFilterNode',
    'Blob',
    'BlobEvent',
    'BluetoothUUID',
    'BroadcastChannel',
    'BrowserCaptureMediaStreamTrack',
    'ByteLengthQueuingStrategy',
    'CDATASection',
    'CSS',
    'CSSAnimation',
    'CSSConditionRule',
    'CSSContainerRule',
    'CSSCounterStyleRule',
    'CSSFontFaceRule',
    'CSSFontPaletteValuesRule',
    'CSSGroupingRule',
    'CSSImageValue',
    'CSSImportRule',
    'CSSKeyframeRule',
    'CSSKeyframesRule',
    'CSSKeywordValue',
    'CSSLayerBlockRule',
    'CSSLayerStatementRule',
    'CSSMathClamp',
    'CSSMathInvert',
    'CSSMathMax',
    'CSSMathMin',
    'CSSMathNegate',
    'CSSMathProduct',
    'CSSMathSum',
    'CSSMathValue',
    'CSSMatrixComponent',
    'CSSMediaRule',
    'CSSNamespaceRule',
    'CSSNumericArray',
    'CSSNumericValue',
    'CSSPageRule',
    'CSSPerspective',
    'CSSPositionValue',
    'CSSPropertyRule',
    'CSSRotate',
    'CSSRule',
    'CSSRuleList',
    'CSSScale',
    'CSSSkew',
    'CSSSkewX',
    'CSSSkewY',
    'CSSStyleDeclaration',
    'CSSStyleRule',
    'CSSStyleSheet',
    'CSSStyleValue',
    'CSSSupportsRule',
    'CSSTransformComponent',
    'CSSTransformValue',
    'CSSTransition',
    'CSSTranslate',
    'CSSUnitValue',
    'CSSUnparsedValue',
    'CSSVariableReferenceValue',
    'CanvasCaptureMediaStreamTrack',
    'CanvasFilter',
    'CanvasGradient',
    'CanvasPattern',
    'CanvasRenderingContext2D',
    'ChannelMergerNode',
    'ChannelSplitterNode',
    'CharacterData',
    'ClipboardEvent',
    'CloseEvent',
    'Comment',
    'CompositionEvent',
    'CompressionStream',
    'ConstantSourceNode',
    'ContentVisibilityAutoStateChangeEvent',
    'ConvolverNode',
    'CountQueuingStrategy',
    'CropTarget',
    'Crypto',
    'CustomElementRegistry',
    'CustomEvent',
    'CustomStateSet',
    'DOMError',
    'DOMException',
    'DOMImplementation',
    'DOMMatrix',
    'DOMMatrixReadOnly',
    'DOMParser',
    'DOMPoint',
    'DOMPointReadOnly',
    'DOMQuad',
    'DOMRect',
    'DOMRectList',
    'DOMRectReadOnly',
    'DOMStringList',
    'DOMStringMap',
    'DOMTokenList',
    'DataTransfer',
    'DataTransferItem',
    'DataTransferItemList',
    'DecompressionStream',
    'DelayNode',
    'DelegatedInkTrailPresenter',
    'Document',
    'DocumentFragment',
    'DocumentTimeline',
    'DocumentType',
    'DragEvent',
    'DynamicsCompressorNode',
    'Element',
    'ElementInternals',
    'EncodedAudioChunk',
    'EncodedVideoChunk',
    'ErrorEvent',
    'EventCounts',
    'EventSource',
    'External',
    'FeaturePolicy',
    'File',
    'FileList',
    'FileReader',
    'FocusEvent',
    'FontFace',
    'FontFaceSetLoadEvent',
    'FormData',
    'FormDataEvent',
    'FragmentDirective',
    'GainNode',
    'Gamepad',
    'GamepadButton',
    'GamepadEvent',
    'GamepadHapticActuator',
    'Geolocation',
    'GeolocationCoordinates',
    'GeolocationPosition',
    'GeolocationPositionError',
    'HTMLAllCollection',
    'HTMLAnchorElement',
    'HTMLAreaElement',
    'HTMLAudioElement',
    'HTMLBRElement',
    'HTMLBaseElement',
    'HTMLBodyElement',
    'HTMLButtonElement',
    'HTMLCanvasElement',
    'HTMLCollection',
    'HTMLDListElement',
    'HTMLDataElement',
    'HTMLDataListElement',
    'HTMLDetailsElement',
    'HTMLDialogElement',
    'HTMLDirectoryElement',
    'HTMLDivElement',
    'HTMLDocument',
    'HTMLElement',
    'HTMLEmbedElement',
    'HTMLFieldSetElement',
    'HTMLFontElement',
    'HTMLFormControlsCollection',
    'HTMLFormElement',
    'HTMLFrameElement',
    'HTMLFrameSetElement',
    'HTMLHRElement',
    'HTMLHeadElement',
    'HTMLHeadingElement',
    'HTMLHtmlElement',
    'HTMLIFrameElement',
    'HTMLImageElement',
    'HTMLInputElement',
    'HTMLLIElement',
    'HTMLLabelElement',
    'HTMLLegendElement',
    'HTMLLinkElement',
    'HTMLMapElement',
    'HTMLMarqueeElement',
    'HTMLMediaElement',
    'HTMLMenuElement',
    'HTMLMetaElement',
    'HTMLMeterElement',
    'HTMLModElement',
    'HTMLOListElement',
    'HTMLObjectElement',
    'HTMLOptGroupElement',
    'HTMLOptionElement',
    'HTMLOptionsCollection',
    'HTMLOutputElement',
    'HTMLParagraphElement',
    'HTMLParamElement',
    'HTMLPictureElement',
    'HTMLPreElement',
    'HTMLProgressElement',
    'HTMLQuoteElement',
    'HTMLScriptElement',
    'HTMLSelectElement',
    'HTMLSlotElement',
    'HTMLSourceElement',
    'HTMLSpanElement',
    'HTMLStyleElement',
    'HTMLTableCaptionElement',
    'HTMLTableCellElement',
    'HTMLTableColElement',
    'HTMLTableElement',
    'HTMLTableRowElement',
    'HTMLTableSectionElement',
    'HTMLTemplateElement',
    'HTMLTextAreaElement',
    'HTMLTimeElement',
    'HTMLTitleElement',
    'HTMLTrackElement',
    'HTMLUListElement',
    'HTMLUnknownElement',
    'HTMLVideoElement',
    'HashChangeEvent',
    'Headers',
    'Highlight',
    'HighlightRegistry',
    'History',
    'IDBCursor',
    'IDBCursorWithValue',
    'IDBDatabase',
    'IDBFactory',
    'IDBIndex',
    'IDBKeyRange',
    'IDBObjectStore',
    'IDBOpenDBRequest',
    'IDBRequest',
    'IDBTransaction',
    'IDBVersionChangeEvent',
    'IIRFilterNode',
    'IdleDeadline',
    'Image',
    'ImageBitmap',
    'ImageBitmapRenderingContext',
    'ImageCapture',
    'ImageData',
    'ImageTrack',
    'ImageTrackList',
    'Ink',
    'InputDeviceCapabilities',
    'InputDeviceInfo',
    'InputEvent',
    'IntersectionObserver',
    'IntersectionObserverEntry',
    'KeyboardEvent',
    'KeyframeEffect',
    'LargestContentfulPaint',
    'LaunchParams',
    'LaunchQueue',
    'LayoutShift',
    'LayoutShiftAttribution',
    'Location',
    'MediaCapabilities',
    'MediaElementAudioSourceNode',
    'MediaEncryptedEvent',
    'MediaError',
    'MediaList',
    'MediaMetadata',
    'MediaQueryList',
    'MediaQueryListEvent',
    'MediaRecorder',
    'MediaSession',
    'MediaSource',
    'MediaSourceHandle',
    'MediaStream',
    'MediaStreamAudioDestinationNode',
    'MediaStreamAudioSourceNode',
    'MediaStreamEvent',
    'MediaStreamTrack',
    'MediaStreamTrackEvent',
    'MediaStreamTrackGenerator',
    'MediaStreamTrackProcessor',
    'MimeType',
    'MimeTypeArray',
    'MouseEvent',
    'MutationEvent',
    'MutationObserver',
    'MutationRecord',
    'NamedNodeMap',
    'NavigateEvent',
    'Navigation',
    'NavigationCurrentEntryChangeEvent',
    'NavigationDestination',
    'NavigationHistoryEntry',
    'NavigationTransition',
    'Navigator',
    'NavigatorUAData',
    'NetworkInformation',
    'Node',
    'NodeFilter',
    'NodeIterator',
    'NodeList',
    'Notification',
    'OfflineAudioCompletionEvent',
    'OfflineAudioContext',
    'OffscreenCanvas',
    'OffscreenCanvasRenderingContext2D',
    'Option',
    'OscillatorNode',
    'OverconstrainedError',
    'PageTransitionEvent',
    'PannerNode',
    'Path2D',
    'PaymentInstruments',
    'PaymentManager',
    'PaymentRequestUpdateEvent',
    'Performance',
    'PerformanceElementTiming',
    'PerformanceEntry',
    'PerformanceEventTiming',
    'PerformanceLongTaskTiming',
    'PerformanceMark',
    'PerformanceMeasure',
    'PerformanceNavigation',
    'PerformanceNavigationTiming',
    'PerformanceObserver',
    'PerformanceObserverEntryList',
    'PerformancePaintTiming',
    'PerformanceResourceTiming',
    'PerformanceServerTiming',
    'PerformanceTiming',
    'PeriodicSyncManager',
    'PeriodicWave',
    'PermissionStatus',
    'Permissions',
    'PictureInPictureEvent',
    'PictureInPictureWindow',
    'Plugin',
    'PluginArray',
    'PointerEvent',
    'PopStateEvent',
    'ProcessingInstruction',
    'Profiler',
    'ProgressEvent',
    'PromiseRejectionEvent',
    'PushManager',
    'PushSubscription',
    'PushSubscriptionOptions',
    'RTCCertificate',
    'RTCDTMFSender',
    'RTCDTMFToneChangeEvent',
    'RTCDataChannel',
    'RTCDataChannelEvent',
    'RTCDtlsTransport',
    'RTCEncodedAudioFrame',
    'RTCEncodedVideoFrame',
    'RTCError',
    'RTCErrorEvent',
    'RTCIceCandidate',
    'RTCIceTransport',
    'RTCPeerConnection',
    'RTCPeerConnectionIceErrorEvent',
    'RTCPeerConnectionIceEvent',
    'RTCRtpReceiver',
    'RTCRtpSender',
    'RTCRtpTransceiver',
    'RTCSctpTransport',
    'RTCSessionDescription',
    'RTCStatsReport',
    'RTCTrackEvent',
    'RadioNodeList',
    'Range',
    'ReadableByteStreamController',
    'ReadableStream',
    'ReadableStreamBYOBReader',
    'ReadableStreamBYOBRequest',
    'ReadableStreamDefaultController',
    'ReadableStreamDefaultReader',
    'RemotePlayback',
    'ReportingObserver',
    'Request',
    'ResizeObserver',
    'ResizeObserverEntry',
    'ResizeObserverSize',
    'Response',
    'SVGAElement',
    'SVGAngle',
    'SVGAnimateElement',
    'SVGAnimateMotionElement',
    'SVGAnimateTransformElement',
    'SVGAnimatedAngle',
    'SVGAnimatedBoolean',
    'SVGAnimatedEnumeration',
    'SVGAnimatedInteger',
    'SVGAnimatedLength',
    'SVGAnimatedLengthList',
    'SVGAnimatedNumber',
    'SVGAnimatedNumberList',
    'SVGAnimatedPreserveAspectRatio',
    'SVGAnimatedRect',
    'SVGAnimatedString',
    'SVGAnimatedTransformList',
    'SVGAnimationElement',
    'SVGCircleElement',
    'SVGClipPathElement',
    'SVGComponentTransferFunctionElement',
    'SVGDefsElement',
    'SVGDescElement',
    'SVGElement',
    'SVGEllipseElement',
    'SVGFEBlendElement',
    'SVGFEColorMatrixElement',
    'SVGFEComponentTransferElement',
    'SVGFECompositeElement',
    'SVGFEConvolveMatrixElement',
    'SVGFEDiffuseLightingElement',
    'SVGFEDisplacementMapElement',
    'SVGFEDistantLightElement',
    'SVGFEDropShadowElement',
    'SVGFEFloodElement',
    'SVGFEFuncAElement',
    'SVGFEFuncBElement',
    'SVGFEFuncGElement',
    'SVGFEFuncRElement',
    'SVGFEGaussianBlurElement',
    'SVGFEImageElement',
    'SVGFEMergeElement',
    'SVGFEMergeNodeElement',
    'SVGFEMorphologyElement',
    'SVGFEOffsetElement',
    'SVGFEPointLightElement',
    'SVGFESpecularLightingElement',
    'SVGFESpotLightElement',
    'SVGFETileElement',
    'SVGFETurbulenceElement',
    'SVGFilterElement',
    'SVGForeignObjectElement',
    'SVGGElement',
    'SVGGeometryElement',
    'SVGGradientElement',
    'SVGGraphicsElement',
    'SVGImageElement',
    'SVGLength',
    'SVGLengthList',
    'SVGLineElement',
    'SVGLinearGradientElement',
    'SVGMPathElement',
    'SVGMarkerElement',
    'SVGMaskElement',
    'SVGMatrix',
    'SVGMetadataElement',
    'SVGNumber',
    'SVGNumberList',
    'SVGPathElement',
    'SVGPatternElement',
    'SVGPoint',
    'SVGPointList',
    'SVGPolygonElement',
    'SVGPolylineElement',
    'SVGPreserveAspectRatio',
    'SVGRadialGradientElement',
    'SVGRect',
    'SVGRectElement',
    'SVGSVGElement',
    'SVGScriptElement',
    'SVGSetElement',
    'SVGStopElement',
    'SVGStringList',
    'SVGStyleElement',
    'SVGSwitchElement',
    'SVGSymbolElement',
    'SVGTSpanElement',
    'SVGTextContentElement',
    'SVGTextElement',
    'SVGTextPathElement',
    'SVGTextPositioningElement',
    'SVGTitleElement',
    'SVGTransform',
    'SVGTransformList',
    'SVGUnitTypes',
    'SVGUseElement',
    'SVGViewElement',
    'Scheduler',
    'Scheduling',
    'Screen',
    'ScreenOrientation',
    'ScriptProcessorNode',
    'SecurityPolicyViolationEvent',
    'Selection',
    'ShadowRoot',
    'SharedWorker',
    'SourceBuffer',
    'SourceBufferList',
    'SpeechSynthesisErrorEvent',
    'SpeechSynthesisEvent',
    'SpeechSynthesisUtterance',
    'StaticRange',
    'StereoPannerNode',
    'Storage',
    'StorageEvent',
    'StylePropertyMap',
    'StylePropertyMapReadOnly',
    'StyleSheet',
    'StyleSheetList',
    'SubmitEvent',
    'SyncManager',
    'TaskAttributionTiming',
    'TaskController',
    'TaskPriorityChangeEvent',
    'TaskSignal',
    'Text',
    'TextDecoderStream',
    'TextEncoderStream',
    'TextEvent',
    'TextMetrics',
    'TextTrack',
    'TextTrackCue',
    'TextTrackCueList',
    'TextTrackList',
    'TimeRanges',
    'Touch',
    'TouchEvent',
    'TouchList',
    'TrackEvent',
    'TransformStream',
    'TransformStreamDefaultController',
    'TransitionEvent',
    'TreeWalker',
    'TrustedHTML',
    'TrustedScript',
    'TrustedScriptURL',
    'TrustedTypePolicy',
    'TrustedTypePolicyFactory',
    'UIEvent',
    'URLPattern',
    'UserActivation',
    'VTTCue',
    'ValidityState',
    'VideoColorSpace',
    'VideoFrame',
    'VideoPlaybackQuality',
    'VirtualKeyboardGeometryChangeEvent',
    'VisualViewport',
    'WaveShaperNode',
    'WebGL2RenderingContext',
    'WebGLActiveInfo',
    'WebGLBuffer',
    'WebGLContextEvent',
    'WebGLFramebuffer',
    'WebGLProgram',
    'WebGLQuery',
    'WebGLRenderbuffer',
    'WebGLRenderingContext',
    'WebGLSampler',
    'WebGLShader',
    'WebGLShaderPrecisionFormat',
    'WebGLSync',
    'WebGLTexture',
    'WebGLTransformFeedback',
    'WebGLUniformLocation',
    'WebGLVertexArrayObject',
    'WebKitCSSMatrix',
    'WebKitMutationObserver',
    'WebSocket',
    'WheelEvent',
    'Window',
    'WindowControlsOverlay',
    'WindowControlsOverlayGeometryChangeEvent',
    'Worker',
    'WritableStream',
    'WritableStreamDefaultController',
    'WritableStreamDefaultWriter',
    'XMLDocument',
    'XMLHttpRequest',
    'XMLHttpRequestEventTarget',
    'XMLHttpRequestUpload',
    'XMLSerializer',
    'XPathEvaluator',
    'XPathExpression',
    'XPathResult',
    'XSLTProcessor',
];
const variables = [
    'alert',
    'blur',
    'cancelAnimationFrame',
    'cancelIdleCallback',
    'captureEvents',
    'chrome',
    'clientInformation',
    // 'close',
    // 'closed',
    'confirm',
    'createImageBitmap',
    'crossOriginIsolated',
    'customElements',
    'devicePixelRatio',
    'document',
    // 'event',
    // 'external',
    // 'find',
    // 'focus',
    'frameElement',
    'frames',
    'getComputedStyle',
    'getSelection',
    'history',
    'indexedDB',
    'innerHeight',
    'innerWidth',
    'isSecureContext',
    'launchQueue',
    // 'length',
    'localStorage',
    'location',
    'locationbar',
    'matchMedia',
    'menubar',
    'moveBy',
    'moveTo',
    // 'name',
    'navigation',
    'navigator',
    'offscreenBuffering',
    'onabort',
    'onafterprint',
    'onanimationend',
    'onanimationiteration',
    'onanimationstart',
    'onappinstalled',
    'onauxclick',
    'onbeforeinput',
    'onbeforeinstallprompt',
    'onbeforematch',
    'onbeforeprint',
    'onbeforeunload',
    'onbeforexrselect',
    'onblur',
    'oncancel',
    'oncanplay',
    'oncanplaythrough',
    'onchange',
    'onclick',
    'onclose',
    'oncontentvisibilityautostatechange',
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
    'ongotpointercapture',
    'onhashchange',
    'oninput',
    'oninvalid',
    'onkeydown',
    'onkeypress',
    'onkeyup',
    'onlanguagechange',
    'onload',
    'onloadeddata',
    'onloadedmetadata',
    'onloadstart',
    'onlostpointercapture',
    'onmessage',
    'onmessageerror',
    'onmousedown',
    'onmouseenter',
    'onmouseleave',
    'onmousemove',
    'onmouseout',
    'onmouseover',
    'onmouseup',
    'onmousewheel',
    'onoffline',
    'ononline',
    'onpagehide',
    'onpageshow',
    'onpause',
    'onplay',
    'onplaying',
    'onpointercancel',
    'onpointerdown',
    'onpointerenter',
    'onpointerleave',
    'onpointermove',
    'onpointerout',
    'onpointerover',
    'onpointerrawupdate',
    'onpointerup',
    'onpopstate',
    'onprogress',
    'onratechange',
    'onrejectionhandled',
    'onreset',
    'onresize',
    'onscroll',
    'onsearch',
    'onsecuritypolicyviolation',
    'onseeked',
    'onseeking',
    'onselect',
    'onselectionchange',
    'onselectstart',
    'onslotchange',
    'onstalled',
    'onstorage',
    'onsubmit',
    'onsuspend',
    'ontimeupdate',
    'ontoggle',
    'ontransitioncancel',
    'ontransitionend',
    'ontransitionrun',
    'ontransitionstart',
    'onunhandledrejection',
    'onunload',
    'onvolumechange',
    'onwaiting',
    'onwebkitanimationend',
    'onwebkitanimationiteration',
    'onwebkitanimationstart',
    'onwebkittransitionend',
    'onwheel',
    'open',
    'openDatabase',
    'opener',
    'origin',
    'originAgentCluster',
    'outerHeight',
    'outerWidth',
    'pageXOffset',
    'pageYOffset',
    // 'parent',
    'personalbar',
    'postMessage',
    'print',
    'prompt',
    'releaseEvents',
    'reportError',
    'requestAnimationFrame',
    'requestIdleCallback',
    'resizeBy',
    'resizeTo',
    'scheduler',
    'screen',
    'screenLeft',
    'screenTop',
    'screenX',
    'screenY',
    'scroll',
    'scrollBy',
    'scrollTo',
    'scrollX',
    'scrollY',
    'scrollbars',
    // 'self',
    'sessionStorage',
    'speechSynthesis',
    'status',
    'statusbar',
    'stop',
    'structuredClone',
    'styleMedia',
    'toolbar',
    // 'top',
    'tracePrototypeChainOf',
    'trustedTypes',
    'visualViewport',
    'webkitCancelAnimationFrame',
    'webkitMediaStream',
    'webkitRTCPeerConnection',
    'webkitRequestAnimationFrame',
    'webkitRequestFileSystem',
    'webkitResolveLocalFileSystemURL',
    'webkitSpeechGrammar',
    'webkitSpeechGrammarList',
    'webkitSpeechRecognition',
    'webkitSpeechRecognitionError',
    'webkitSpeechRecognitionEvent',
    'webkitStorageInfo',
    'webkitURL',
    'window',
];

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
                    message: '`document`, like most browser APIs, is not accessible during SSR.',
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
                    message: '`document`, like most browser APIs, is not accessible during SSR.',
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
                    message: '`document`, like most browser APIs, is not accessible during SSR.',
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
                    message: '`document`, like most browser APIs, is not accessible during SSR.',
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
                    message: '`document`, like most browser APIs, is not accessible during SSR.',
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
                    message: '`document`, like most browser APIs, is not accessible during SSR.',
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
                    message: '`window`, like most browser APIs, is not accessible during SSR.',
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
                    message: '`window`, like most browser APIs, is not accessible during SSR.',
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
                    message: '`window`, like most browser APIs, is not accessible during SSR.',
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
                    message: '`window`, like most browser APIs, is not accessible during SSR.',
                },
            ],
        },
        ...classes.map((klass) => ({
            code: `const foo = new ${klass}()`,
            errors: [
                {
                    message: `\`${klass}\`, like most browser APIs, is not accessible during SSR.`,
                },
            ],
        })),
        ...variables.map((variable) => ({
            code: `onlyValidInTheBrowser(${variable});`,
            errors: [
                {
                    message: `\`${variable}\`, like most browser APIs, is not accessible during SSR.`,
                },
            ],
        })),
    ],
});
