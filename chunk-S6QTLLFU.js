import{a as re}from"./chunk-PSTD2D7J.js";import{a as le}from"./chunk-FKOEVO4B.js";import{a as Y,e as Z,i as ee,n as te,t as oe}from"./chunk-CQCVERZP.js";import{ha as ie,ia as v,la as ne}from"./chunk-4G3JCKZK.js";import{c as K,g as X,l as C}from"./chunk-QOJUQ6XD.js";import{$ as E,$b as x,Ab as f,Bb as O,Cb as Q,Ec as U,Hb as a,Ib as d,Jb as g,Kb as z,Oc as $,Qb as H,Rb as b,Wb as h,Xb as j,Xc as V,Yc as J,Za as p,_ as F,_b as M,aa as I,ac as k,bc as y,db as D,ea as B,hc as R,ic as u,ja as s,jb as w,ka as c,kb as L,nb as A,nc as q,oc as P,pb as m,pc as W,qc as G,rb as N,sc as _,za as S}from"./chunk-A4JG42N6.js";var se=`
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
`;var ue=["handle"],pe=["input"],we=e=>({checked:e});function me(e,r){e&1&&H(0)}function fe(e,r){if(e&1&&m(0,me,1,0,"ng-container",2),e&2){let i=j();a("ngTemplateOutlet",i.handleTemplate||i._handleTemplate)("ngTemplateOutletContext",_(2,we,i.checked()))}}var be=`
    ${se}

    p-toggleswitch.ng-invalid.ng-dirty > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }
`,ke={root:{position:"relative"}},ye={root:({instance:e})=>["p-toggleswitch p-component",{"p-toggleswitch p-component":!0,"p-toggleswitch-checked":e.checked(),"p-disabled":e.$disabled(),"p-invalid":e.invalid()}],input:"p-toggleswitch-input",slider:"p-toggleswitch-slider",handle:"p-toggleswitch-handle"},ce=(()=>{class e extends ne{name="toggleswitch";theme=be;classes=ye;inlineStyles=ke;static \u0275fac=(()=>{let i;return function(t){return(i||(i=S(e)))(t||e)}})();static \u0275prov=E({token:e,factory:e.\u0275fac})}return e})();var _e={provide:Y,useExisting:F(()=>T),multi:!0},T=(()=>{class e extends le{styleClass;tabindex;inputId;readonly;trueValue=!0;falseValue=!1;ariaLabel;size=$();ariaLabelledBy;autofocus;onChange=new N;input;handleTemplate;_handleTemplate;focused=!1;_componentStyle=B(ce);templates;onHostClick(i){this.onClick(i)}ngAfterContentInit(){this.templates.forEach(i=>{switch(i.getType()){case"handle":this._handleTemplate=i.template;break;default:this._handleTemplate=i.template;break}})}onClick(i){!this.$disabled()&&!this.readonly&&(this.writeModelValue(this.checked()?this.falseValue:this.trueValue),this.onModelChange(this.modelValue()),this.onChange.emit({originalEvent:i,checked:this.modelValue()}),this.input.nativeElement.focus())}onFocus(){this.focused=!0}onBlur(){this.focused=!1,this.onModelTouched()}checked(){return this.modelValue()===this.trueValue}writeControlValue(i,n){n(i),this.cd.markForCheck()}static \u0275fac=(()=>{let i;return function(t){return(i||(i=S(e)))(t||e)}})();static \u0275cmp=w({type:e,selectors:[["p-toggleswitch"],["p-toggleSwitch"],["p-toggle-switch"]],contentQueries:function(n,t,l){if(n&1&&(M(l,ue,4),M(l,ie,4)),n&2){let o;k(o=y())&&(t.handleTemplate=o.first),k(o=y())&&(t.templates=o)}},viewQuery:function(n,t){if(n&1&&x(pe,5),n&2){let l;k(l=y())&&(t.input=l.first)}},hostVars:6,hostBindings:function(n,t){n&1&&h("click",function(o){return t.onHostClick(o)}),n&2&&(f("data-pc-name","toggleswitch")("data-pc-section","root"),R(t.sx("root")),u(t.cn(t.cx("root"),t.styleClass)))},inputs:{styleClass:"styleClass",tabindex:[2,"tabindex","tabindex",J],inputId:"inputId",readonly:[2,"readonly","readonly",V],trueValue:"trueValue",falseValue:"falseValue",ariaLabel:"ariaLabel",size:[1,"size"],ariaLabelledBy:"ariaLabelledBy",autofocus:[2,"autofocus","autofocus",V]},outputs:{onChange:"onChange"},features:[G([_e,ce]),A],decls:5,vars:19,consts:[["input",""],["type","checkbox","role","switch",3,"focus","blur","checked","pAutoFocus"],[4,"ngTemplateOutlet","ngTemplateOutletContext"]],template:function(n,t){if(n&1){let l=b();d(0,"input",1,0),h("focus",function(){return s(l),c(t.onFocus())})("blur",function(){return s(l),c(t.onBlur())}),g(),d(2,"div")(3,"div"),O(4,fe,1,4,"ng-container"),g()()}n&2&&(u(t.cx("input")),a("checked",t.checked())("pAutoFocus",t.autofocus),f("id",t.inputId)("required",t.required()?"":void 0)("disabled",t.$disabled()?"":void 0)("aria-checked",t.checked())("aria-labelledby",t.ariaLabelledBy)("aria-label",t.ariaLabel)("name",t.name())("tabindex",t.tabindex)("data-pc-section","hiddenInput"),p(2),u(t.cx("slider")),f("data-pc-section","slider"),p(),u(t.cx("handle")),p(),Q(t.handleTemplate||t._handleTemplate?4:-1))},dependencies:[C,X,oe,v],encapsulation:2,changeDetection:0})}return e})(),ae=(()=>{class e{static \u0275fac=function(n){return new(n||e)};static \u0275mod=L({type:e});static \u0275inj=I({imports:[T,v,v]})}return e})();var ve=e=>[e];function Te(e,r){if(e&1&&z(0,"i",2),e&2){let i=r.checked;a("ngClass",_(1,ve,i?"pi pi-moon":"pi pi-sun"))}}var de=class e{constructor(r){this.themeService=r;this.checked=r.isDarkTheme()}checked=!1;static \u0275fac=function(i){return new(i||e)(D(re))};static \u0275cmp=w({type:e,selectors:[["app-theme-switcher"]],decls:3,vars:1,consts:[["handle",""],[3,"ngModelChange","onChange","ngModel"],[3,"ngClass"]],template:function(i,n){if(i&1){let t=b();d(0,"p-toggleswitch",1),W("ngModelChange",function(o){return s(t),P(n.checked,o)||(n.checked=o),c(o)}),h("onChange",function(){return s(t),c(n.themeService.toggleTheme())}),m(1,Te,1,3,"ng-template",null,0,U),g()}i&2&&q("ngModel",n.checked)},dependencies:[ae,T,te,Z,ee,C,K],styles:[".pi[_ngcontent-%COMP%]{color:#000}"]})};export{de as a};
