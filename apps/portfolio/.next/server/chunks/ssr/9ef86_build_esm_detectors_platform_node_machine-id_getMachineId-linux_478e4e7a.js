;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="a4185bb0-a246-7279-6291-90bbe2cb7909")}catch(e){}}();
module.exports=[36860,a=>{"use strict";var b=a.i(522734),c=a.i(84151);async function d(){for(let a of["/etc/machine-id","/var/lib/dbus/machine-id"])try{return(await b.promises.readFile(a,{encoding:"utf8"})).trim()}catch(a){c.diag.debug(`error reading machine id: ${a}`)}}a.s(["getMachineId",()=>d])}];

//# debugId=a4185bb0-a246-7279-6291-90bbe2cb7909
//# sourceMappingURL=9ef86_build_esm_detectors_platform_node_machine-id_getMachineId-linux_478e4e7a.js.map