/*
 * File: app/store/ContentSelectorStore2.js
 *
 * This file was generated by Sencha Architect version 3.1.0.
 * http://www.sencha.com/products/architect/
 *
 * This file requires use of the Ext JS 4.2.x library, under independent license.
 * License of Sencha Architect does not include license for Ext JS 4.2.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('Rubedo.store.ContentSelectorStore2', {
    extend: 'Ext.data.Store',
    alias: 'store.ContentSelectorStore2',

    requires: [
        'Rubedo.model.contenusDataModel',
        'Ext.data.proxy.Ajax',
        'Ext.data.reader.Json'
    ],

    constructor: function(cfg) {
        var me = this;
        cfg = cfg || {};
        me.callParent([Ext.apply({
            model: 'Rubedo.model.contenusDataModel',
            remoteFilter: true,
            remoteSort: true,
            storeId: 'ContentSelectorStore2',
            pageSize: 50,
            proxy: {
                type: 'ajax',
                api: {
                    read: 'contents'
                },
                reader: {
                    type: 'json',
                    messageProperty: 'message',
                    root: 'data'
                }
            },
            listeners: {
                beforeload: {
                    fn: me.onJsonstoreBeforeLoad,
                    scope: me
                },
                add: {
                    fn: me.onJsonstoreAdd,
                    scope: me
                },
                remove: {
                    fn: me.onJsonstoreRemove,
                    scope: me
                }
            }
        }, cfg)]);
    },

    onJsonstoreBeforeLoad: function(store, operation, eOpts) {
        var raw = Ext.getStore("ContentMQueryStore").getRange();
        var refined = Ext.Array.pluck(Ext.Array.pluck(raw, "data"), "id");
        var productFilter=Ext.JSON.encode({property:"isProduct",value:{"$ne":true}});
        if (Ext.getCmp("manualQueryInterface").isProductQuery){
            productFilter=Ext.JSON.encode({property:"isProduct",value:true});
        }
        store.getProxy().extraParams.tFilter="["+productFilter+",{\"property\":\"id\",\"operator\":\"$nin\",\"value\":"+Ext.JSON.encode(refined)+"},{\"property\":\"typeId\",\"operator\":\"$nin\",\"value\":"+Ext.JSON.encode(Ext.Array.pluck(Ext.Array.pluck(Ext.getStore("SystemCTStore").getRange(),"data"), "id"))+"}]";
    },

    onJsonstoreAdd: function(store, records, index, eOpts) {
        store.totalCount=store.totalCount+1;
        store.fireEvent("load");
    },

    onJsonstoreRemove: function(store, record, index, isMove, eOpts) {
        store.totalCount=store.totalCount-1;
        store.fireEvent("load");
    }

});