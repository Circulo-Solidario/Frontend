import{ia as e,la as h,na as v}from"./chunk-4G3JCKZK.js";import{l as y}from"./chunk-QOJUQ6XD.js";import{$ as i,Ab as c,Yb as g,Zb as f,aa as u,ea as d,gc as M,hc as w,ic as m,jb as a,kb as s,nb as l,qc as b,za as r}from"./chunk-A4JG42N6.js";var I=`
    .p-inputgroup,
    .p-inputgroup .p-iconfield,
    .p-inputgroup .p-floatlabel,
    .p-inputgroup .p-iftalabel {
        display: flex;
        align-items: stretch;
        width: 100%;
    }

    .p-inputgroup .p-inputtext,
    .p-inputgroup .p-inputwrapper {
        flex: 1 1 auto;
        width: 1%;
    }

    .p-inputgroupaddon {
        display: flex;
        align-items: center;
        justify-content: center;
        padding: dt('inputgroup.addon.padding');
        background: dt('inputgroup.addon.background');
        color: dt('inputgroup.addon.color');
        border-block-start: 1px solid dt('inputgroup.addon.border.color');
        border-block-end: 1px solid dt('inputgroup.addon.border.color');
        min-width: dt('inputgroup.addon.min.width');
    }

    .p-inputgroupaddon:first-child,
    .p-inputgroupaddon + .p-inputgroupaddon {
        border-inline-start: 1px solid dt('inputgroup.addon.border.color');
    }

    .p-inputgroupaddon:last-child {
        border-inline-end: 1px solid dt('inputgroup.addon.border.color');
    }

    .p-inputgroupaddon:has(.p-button) {
        padding: 0;
        overflow: hidden;
    }

    .p-inputgroupaddon .p-button {
        border-radius: 0;
    }

    .p-inputgroup > .p-component,
    .p-inputgroup > .p-inputwrapper > .p-component,
    .p-inputgroup > .p-iconfield > .p-component,
    .p-inputgroup > .p-floatlabel > .p-component,
    .p-inputgroup > .p-floatlabel > .p-inputwrapper > .p-component,
    .p-inputgroup > .p-iftalabel > .p-component,
    .p-inputgroup > .p-iftalabel > .p-inputwrapper > .p-component {
        border-radius: 0;
        margin: 0;
    }

    .p-inputgroupaddon:first-child,
    .p-inputgroup > .p-component:first-child,
    .p-inputgroup > .p-inputwrapper:first-child > .p-component,
    .p-inputgroup > .p-iconfield:first-child > .p-component,
    .p-inputgroup > .p-floatlabel:first-child > .p-component,
    .p-inputgroup > .p-floatlabel:first-child > .p-inputwrapper > .p-component,
    .p-inputgroup > .p-iftalabel:first-child > .p-component,
    .p-inputgroup > .p-iftalabel:first-child > .p-inputwrapper > .p-component {
        border-start-start-radius: dt('inputgroup.addon.border.radius');
        border-end-start-radius: dt('inputgroup.addon.border.radius');
    }

    .p-inputgroupaddon:last-child,
    .p-inputgroup > .p-component:last-child,
    .p-inputgroup > .p-inputwrapper:last-child > .p-component,
    .p-inputgroup > .p-iconfield:last-child > .p-component,
    .p-inputgroup > .p-floatlabel:last-child > .p-component,
    .p-inputgroup > .p-floatlabel:last-child > .p-inputwrapper > .p-component,
    .p-inputgroup > .p-iftalabel:last-child > .p-component,
    .p-inputgroup > .p-iftalabel:last-child > .p-inputwrapper > .p-component {
        border-start-end-radius: dt('inputgroup.addon.border.radius');
        border-end-end-radius: dt('inputgroup.addon.border.radius');
    }

    .p-inputgroup .p-component:focus,
    .p-inputgroup .p-component.p-focus,
    .p-inputgroup .p-inputwrapper-focus,
    .p-inputgroup .p-component:focus ~ label,
    .p-inputgroup .p-component.p-focus ~ label,
    .p-inputgroup .p-inputwrapper-focus ~ label {
        z-index: 1;
    }

    .p-inputgroup > .p-button:not(.p-button-icon-only) {
        width: auto;
    }

    .p-inputgroup .p-iconfield + .p-iconfield .p-inputtext {
        border-inline-start: 0;
    }
`;var D=["*"],j=`
    ${I}

    /*For PrimeNG*/

    .p-inputgroup > .p-component,
    .p-inputgroup > .p-inputwrapper > .p-component,
    .p-inputgroup:first-child > p-button > .p-button,
    .p-inputgroup > .p-floatlabel > .p-component,
    .p-inputgroup > .p-floatlabel > .p-inputwrapper > .p-component,
    .p-inputgroup > .p-iftalabel > .p-component,
    .p-inputgroup > .p-iftalabel > .p-inputwrapper > .p-component {
        border-radius: 0;
        margin: 0;
    }

    .p-inputgroup p-button:first-child,
    .p-inputgroup p-button:last-child {
        display: inline-flex;
    }

    .p-inputgroup:has(> p-button:first-child) .p-button {
        border-start-start-radius: dt('inputgroup.addon.border.radius');
        border-end-start-radius: dt('inputgroup.addon.border.radius');
    }

    .p-inputgroup:has(> p-button:last-child) .p-button {
        border-start-end-radius: dt('inputgroup.addon.border.radius');
        border-end-end-radius: dt('inputgroup.addon.border.radius');
    }

    .p-inputgroup > p-inputmask > .p-inputtext {
        width: 100%;
    }
`,B={root:({instance:n})=>["p-inputgroup",{"p-inputgroup-fluid":n.fluid}]},x=(()=>{class n extends h{name="inputgroup";theme=j;classes=B;static \u0275fac=(()=>{let t;return function(p){return(t||(t=r(n)))(p||n)}})();static \u0275prov=i({token:n,factory:n.\u0275fac})}return n})();var G=(()=>{class n extends v{styleClass;_componentStyle=d(x);static \u0275fac=(()=>{let t;return function(p){return(t||(t=r(n)))(p||n)}})();static \u0275cmp=a({type:n,selectors:[["p-inputgroup"],["p-inputGroup"],["p-input-group"]],hostVars:3,hostBindings:function(o,p){o&2&&(c("data-pc-name","inputgroup"),m(p.cn(p.cx("root"),p.styleClass)))},inputs:{styleClass:"styleClass"},features:[b([x]),l],ngContentSelectors:D,decls:1,vars:0,template:function(o,p){o&1&&(g(),f(0))},dependencies:[y,e],encapsulation:2})}return n})(),L=(()=>{class n{static \u0275fac=function(o){return new(o||n)};static \u0275mod=s({type:n});static \u0275inj=u({imports:[G,e,e]})}return n})();var S=["*"],k={root:"p-inputgroupaddon"},F=(()=>{class n extends h{name="inputgroupaddon";classes=k;static \u0275fac=(()=>{let t;return function(p){return(t||(t=r(n)))(p||n)}})();static \u0275prov=i({token:n,factory:n.\u0275fac})}return n})(),A=(()=>{class n extends v{style;styleClass;_componentStyle=d(F);get hostStyle(){return this.style}static \u0275fac=(()=>{let t;return function(p){return(t||(t=r(n)))(p||n)}})();static \u0275cmp=a({type:n,selectors:[["p-inputgroup-addon"],["p-inputGroupAddon"]],hostVars:7,hostBindings:function(o,p){o&2&&(c("data-pc-name","inputgroupaddon"),w(p.hostStyle),m(p.styleClass),M("p-inputgroupaddon",!0))},inputs:{style:"style",styleClass:"styleClass"},features:[b([F]),l],ngContentSelectors:S,decls:1,vars:0,template:function(o,p){o&1&&(g(),f(0))},dependencies:[y],encapsulation:2})}return n})(),pn=(()=>{class n{static \u0275fac=function(o){return new(o||n)};static \u0275mod=s({type:n});static \u0275inj=u({imports:[A,e,e]})}return n})();export{G as a,L as b,pn as c};
