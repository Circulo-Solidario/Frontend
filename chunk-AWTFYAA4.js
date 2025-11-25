import{a as re}from"./chunk-3RZ3CXZE.js";import{a as Z,e as ee,i as te,n as ie,t as le}from"./chunk-EXKGDNGF.js";import{Ha as oe,Ia as C,La as ne,c as X,g as Y,l as _}from"./chunk-RM4WEROU.js";import{$ as u,$b as R,Ab as b,Bb as Q,Cb as j,Ec as U,Hb as c,Ib as d,Jb as h,Kb as z,Oc as $,Qb as x,Rb as k,Wb as g,Xb as H,Xc as I,Yc as J,Za as m,_ as F,_b as D,aa as E,ac as y,bc as v,db as B,ea as L,hc as q,ic as p,ja as s,jb as w,ka as a,kb as A,nb as N,nc as P,oc as G,pb as f,pc as K,qc as W,rb as O,sc as T,za as V}from"./chunk-B6WBXPKU.js";var se=`
    .p-toggleswitch {
        display: inline-block;
        width: dt('toggleswitch.width');
        height: dt('toggleswitch.height');
    }

    .p-toggleswitch-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border-radius: dt('toggleswitch.border.radius');
    }

    .p-toggleswitch-slider {
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-width: dt('toggleswitch.border.width');
        border-style: solid;
        border-color: dt('toggleswitch.border.color');
        background: dt('toggleswitch.background');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            border-color dt('toggleswitch.transition.duration'),
            outline-color dt('toggleswitch.transition.duration'),
            box-shadow dt('toggleswitch.transition.duration');
        border-radius: dt('toggleswitch.border.radius');
        outline-color: transparent;
        box-shadow: dt('toggleswitch.shadow');
    }

    .p-toggleswitch-handle {
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: dt('toggleswitch.handle.background');
        color: dt('toggleswitch.handle.color');
        width: dt('toggleswitch.handle.size');
        height: dt('toggleswitch.handle.size');
        inset-inline-start: dt('toggleswitch.gap');
        margin-block-start: calc(-1 * calc(dt('toggleswitch.handle.size') / 2));
        border-radius: dt('toggleswitch.handle.border.radius');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            inset-inline-start dt('toggleswitch.slide.duration'),
            box-shadow dt('toggleswitch.slide.duration');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.background');
        border-color: dt('toggleswitch.checked.border.color');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.background');
        color: dt('toggleswitch.handle.checked.color');
        inset-inline-start: calc(dt('toggleswitch.width') - calc(dt('toggleswitch.handle.size') + dt('toggleswitch.gap')));
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-slider {
        background: dt('toggleswitch.hover.background');
        border-color: dt('toggleswitch.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.hover.background');
        color: dt('toggleswitch.handle.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.hover.background');
        border-color: dt('toggleswitch.checked.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.hover.background');
        color: dt('toggleswitch.handle.checked.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider {
        box-shadow: dt('toggleswitch.focus.ring.shadow');
        outline: dt('toggleswitch.focus.ring.width') dt('toggleswitch.focus.ring.style') dt('toggleswitch.focus.ring.color');
        outline-offset: dt('toggleswitch.focus.ring.offset');
    }

    .p-toggleswitch.p-invalid > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }

    .p-toggleswitch.p-disabled {
        opacity: 1;
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-slider {
        background: dt('toggleswitch.disabled.background');
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.disabled.background');
    }
`;var pe=["handle"],ue=["input"],me=e=>({checked:e});function we(e,n){e&1&&x(0)}function fe(e,n){if(e&1&&f(0,we,1,0,"ng-container",2),e&2){let t=H();c("ngTemplateOutlet",t.handleTemplate||t._handleTemplate)("ngTemplateOutletContext",T(2,me,t.checked()))}}var be=`
    ${se}

    p-toggleswitch.ng-invalid.ng-dirty > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }
`,ke={root:{position:"relative"}},ye={root:({instance:e})=>["p-toggleswitch p-component",{"p-toggleswitch p-component":!0,"p-toggleswitch-checked":e.checked(),"p-disabled":e.$disabled(),"p-invalid":e.invalid()}],input:"p-toggleswitch-input",slider:"p-toggleswitch-slider",handle:"p-toggleswitch-handle"},ae=(()=>{class e extends ne{name="toggleswitch";theme=be;classes=ye;inlineStyles=ke;static \u0275fac=(()=>{let t;return function(i){return(t||(t=V(e)))(i||e)}})();static \u0275prov=u({token:e,factory:e.\u0275fac})}return e})();var ve={provide:Z,useExisting:F(()=>M),multi:!0},M=(()=>{class e extends re{styleClass;tabindex;inputId;readonly;trueValue=!0;falseValue=!1;ariaLabel;size=$();ariaLabelledBy;autofocus;onChange=new O;input;handleTemplate;_handleTemplate;focused=!1;_componentStyle=L(ae);templates;onHostClick(t){this.onClick(t)}ngAfterContentInit(){this.templates.forEach(t=>{switch(t.getType()){case"handle":this._handleTemplate=t.template;break;default:this._handleTemplate=t.template;break}})}onClick(t){!this.$disabled()&&!this.readonly&&(this.writeModelValue(this.checked()?this.falseValue:this.trueValue),this.onModelChange(this.modelValue()),this.onChange.emit({originalEvent:t,checked:this.modelValue()}),this.input.nativeElement.focus())}onFocus(){this.focused=!0}onBlur(){this.focused=!1,this.onModelTouched()}checked(){return this.modelValue()===this.trueValue}writeControlValue(t,o){o(t),this.cd.markForCheck()}static \u0275fac=(()=>{let t;return function(i){return(t||(t=V(e)))(i||e)}})();static \u0275cmp=w({type:e,selectors:[["p-toggleswitch"],["p-toggleSwitch"],["p-toggle-switch"]],contentQueries:function(o,i,r){if(o&1&&(D(r,pe,4),D(r,oe,4)),o&2){let l;y(l=v())&&(i.handleTemplate=l.first),y(l=v())&&(i.templates=l)}},viewQuery:function(o,i){if(o&1&&R(ue,5),o&2){let r;y(r=v())&&(i.input=r.first)}},hostVars:6,hostBindings:function(o,i){o&1&&g("click",function(l){return i.onHostClick(l)}),o&2&&(b("data-pc-name","toggleswitch")("data-pc-section","root"),q(i.sx("root")),p(i.cn(i.cx("root"),i.styleClass)))},inputs:{styleClass:"styleClass",tabindex:[2,"tabindex","tabindex",J],inputId:"inputId",readonly:[2,"readonly","readonly",I],trueValue:"trueValue",falseValue:"falseValue",ariaLabel:"ariaLabel",size:[1,"size"],ariaLabelledBy:"ariaLabelledBy",autofocus:[2,"autofocus","autofocus",I]},outputs:{onChange:"onChange"},features:[W([ve,ae]),N],decls:5,vars:19,consts:[["input",""],["type","checkbox","role","switch",3,"focus","blur","checked","pAutoFocus"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(o,i){if(o&1){let r=k();d(0,"input",1,0),g("focus",function(){return s(r),a(i.onFocus())})("blur",function(){return s(r),a(i.onBlur())}),h(),d(2,"div")(3,"div"),Q(4,fe,1,4,"ng-container"),h()()}o&2&&(p(i.cx("input")),c("checked",i.checked())("pAutoFocus",i.autofocus),b("id",i.inputId)("required",i.required()?"":void 0)("disabled",i.$disabled()?"":void 0)("aria-checked",i.checked())("aria-labelledby",i.ariaLabelledBy)("aria-label",i.ariaLabel)("name",i.name())("tabindex",i.tabindex)("data-pc-section","hiddenInput"),m(2),p(i.cx("slider")),b("data-pc-section","slider"),m(),p(i.cx("handle")),m(),j(i.handleTemplate||i._handleTemplate?4:-1))},dependencies:[_,Y,le,C],encapsulation:2,changeDetection:0})}return e})(),de=(()=>{class e{static \u0275fac=function(o){return new(o||e)};static \u0275mod=A({type:e});static \u0275inj=E({imports:[M,C,C]})}return e})();var S=class e{isDarkMode=!1;themeKey="primeNG-theme-mode";constructor(){this.loadInitialTheme()}loadInitialTheme(){let n=localStorage.getItem(this.themeKey);if(n)this.isDarkMode=n==="dark";else{let t=window.matchMedia("(prefers-color-scheme: dark)").matches;this.isDarkMode=t}this.applyTheme()}toggleTheme(){this.isDarkMode=!this.isDarkMode,this.applyTheme(),localStorage.setItem(this.themeKey,this.isDarkMode?"dark":"light")}applyTheme(){let n=document.documentElement;this.isDarkMode?(n.classList.add("dark-mode"),n.setAttribute("data-theme","dark")):(n.classList.remove("dark-mode"),n.setAttribute("data-theme","light"))}isDarkTheme(){return this.isDarkMode}setTheme(n){this.isDarkMode=n,this.applyTheme(),localStorage.setItem(this.themeKey,n?"dark":"light")}static \u0275fac=function(t){return new(t||e)};static \u0275prov=u({token:e,factory:e.\u0275fac,providedIn:"root"})};var Ce=e=>[e];function Me(e,n){if(e&1&&z(0,"i",2),e&2){let t=n.checked;c("ngClass",T(1,Ce,t?"pi pi-moon":"pi pi-sun"))}}var he=class e{constructor(n){this.themeService=n;this.checked=n.isDarkTheme()}checked=!1;static \u0275fac=function(t){return new(t||e)(B(S))};static \u0275cmp=w({type:e,selectors:[["app-theme-switcher"]],decls:3,vars:1,consts:[["handle",""],[3,"ngModelChange","onChange","ngModel"],[3,"ngClass"]],template:function(t,o){if(t&1){let i=k();d(0,"p-toggleswitch",1),K("ngModelChange",function(l){return s(i),G(o.checked,l)||(o.checked=l),a(l)}),g("onChange",function(){return s(i),a(o.themeService.toggleTheme())}),f(1,Me,1,3,"ng-template",null,0,U),h()}t&2&&P("ngModel",o.checked)},dependencies:[de,M,ie,ee,te,_,X],styles:[".pi[_ngcontent-%COMP%]{color:#000}"]})};export{he as a};
