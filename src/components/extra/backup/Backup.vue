<template>
    <div :class="['backup']">
        <div :class="['backup-title']">{{ ui.title }}</div>
        <v-data-table
            v-if="datas.backupTableDataItems.length > 0"
            :class="['backup-table']"
            :headers="datas.backupTableHeaderItems"
            :items="datas.backupTableDataItems"
            hide-actions
        >
            <template v-slot:items="props" >
                <tr>
                    <td class="text-xs-center tdText" v-for="header in datas.backupTableHeaderItems" :key="header.value">
                        <span v-if="header.type === 'text'">{{ props.item[header.value] }}</span>
                        <v-icon @click="clickBackUpBtn(props.item)" v-if="header.type === 'icon'" color="#04CBE5">{{props.item[header.value]}}</v-icon>
                    </td>
                </tr>
            </template>
        </v-data-table>
        <div v-else :class="['backup-empty']">{{ ui.empty }}</div>
    </div>
</template>

<script>
import { getBackupFileAPI, getBackupListItemsAPI } from "@/api/extra/backupAPI";
import { isEmpty } from "lodash";

export default {
    data() {
        return {
            ui: {
                title: this.$t(`extra.child.backup.title`),
                empty: this.$t(`extra.child.backup.empty`)
            },
            datas: {
                backupTableHeaderItems: [
                    { text: 'No', value: 'id', sortable: false, align: 'center', type: 'text' },
                    { text: this.$t(`extra.child.backup.tableHeader.date`), value: 'date', sortable: false, align: 'center', type: 'text'},
                    { text: this.$t(`extra.child.backup.tableHeader.fileName`), value: 'name', sortable: false, align: 'center', type: 'text'},
                    { text: this.$t(`extra.child.backup.tableHeader.download`), value:'download', sortable: false, align: 'center', type: 'icon'}
                ],
                backupTableDataItems: []
            }
        }
    },

     mounted(){
         this.getBackupList()
    },

    methods: {
        async getBackupList() {
            const backupListResult = await getBackupListItemsAPI();
            if(backupListResult && !isEmpty(backupListResult.data)){
                this.datas.backupTableDataItems = backupListResult.data.map((item, index) => {
                    return {
                        id: index + 1,
                        download: 'mdi-download',
                        ...item
                    };
                });
            }else {
                this.datas.backupTableDataItems = [];
            }
        },

        async clickBackUpBtn(item) {
            try {
                const response = await getBackupFileAPI({
                    path: item.path
                });
                const downloadLink = document.createElement('a');
                const blob = new Blob([response.data], { type: 'application/zip' });
                const url = URL.createObjectURL(blob);

                downloadLink.href = url;
                downloadLink.download = `${item.name}`;
                downloadLink.click();
                URL.revokeObjectURL(url);
            } catch (error) {
                window.alert('Error');
                console.error(error);
            }
        }
    }
}
</script>

<style lang="scss">
    @import "./Backup";
</style>