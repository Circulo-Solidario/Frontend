import{ia as y,la as m,na as g}from"./chunk-4G3JCKZK.js";import{l as u}from"./chunk-QOJUQ6XD.js";import{$ as c,Yb as l,Zb as a,ea as s,ic as p,jb as r,nb as d,qc as f,za as o}from"./chunk-A4JG42N6.js";var h=`
    .p-iconfield {
        position: relative;
        display: block;
    }

    .p-inputicon {
        position: absolute;
        top: 50%;
        margin-top: calc(-1 * (dt('icon.size') / 2));
        color: dt('iconfield.icon.color');
        line-height: 1;
        z-index: 1;
    }

    .p-iconfield .p-inputicon:first-child {
        inset-inline-start: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputicon:last-child {
        inset-inline-end: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputtext:not(:first-child),
    .p-iconfield .p-inputwrapper:not(:first-child) .p-inputtext {
        padding-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield .p-inputtext:not(:last-child) {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield:has(.p-inputfield-sm) .p-inputicon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
        margin-top: calc(-1 * (dt('form.field.sm.font.size') / 2));
    }

    .p-iconfield:has(.p-inputfield-lg) .p-inputicon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
        margin-top: calc(-1 * (dt('form.field.lg.font.size') / 2));
    }
`;var D=["*"],x={root:({instance:e})=>["p-iconfield",{"p-iconfield-left":e.iconPosition=="left","p-iconfield-right":e.iconPosition=="right"}]},v=(()=>{class e extends m{name="iconfield";theme=h;classes=x;static \u0275fac=(()=>{let t;return function(n){return(t||(t=o(e)))(n||e)}})();static \u0275prov=c({token:e,factory:e.\u0275fac})}return e})();var A=(()=>{class e extends g{iconPosition="left";styleClass;_componentStyle=s(v);static \u0275fac=(()=>{let t;return function(n){return(t||(t=o(e)))(n||e)}})();static \u0275cmp=r({type:e,selectors:[["p-iconfield"],["p-iconField"],["p-icon-field"]],hostVars:2,hostBindings:function(i,n){i&2&&p(n.cn(n.cx("root"),n.styleClass))},inputs:{iconPosition:"iconPosition",styleClass:"styleClass"},features:[f([v]),d],ngContentSelectors:D,decls:1,vars:0,template:function(i,n){i&1&&(l(),a(0))},dependencies:[u],encapsulation:2,changeDetection:0})}return e})();var j=["*"],z={root:"p-inputicon"},I=(()=>{class e extends m{name="inputicon";classes=z;static \u0275fac=(()=>{let t;return function(n){return(t||(t=o(e)))(n||e)}})();static \u0275prov=c({token:e,factory:e.\u0275fac})}return e})(),_=(()=>{class e extends g{styleClass;_componentStyle=s(I);static \u0275fac=(()=>{let t;return function(n){return(t||(t=o(e)))(n||e)}})();static \u0275cmp=r({type:e,selectors:[["p-inputicon"],["p-inputIcon"]],hostVars:2,hostBindings:function(i,n){i&2&&p(n.cn(n.cx("root"),n.styleClass))},inputs:{styleClass:"styleClass"},features:[f([I]),d],ngContentSelectors:j,decls:1,vars:0,template:function(i,n){i&1&&(l(),a(0))},dependencies:[u,y],encapsulation:2,changeDetection:0})}return e})();export{A as a,_ as b};
