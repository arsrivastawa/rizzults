import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';

import {
  exportDatabaseData,
  getExportRows,
  restoreDatabaseData,
  type BackupData,
} from '@/db/repo';
import { buildCsv } from '@/lib/csv';

function writeFile(filename: string, content: string): File {
  const file = new File(Paths.cache, filename);
  if (file.exists) {
    file.delete();
  }
  file.create();
  file.write(content);
  return file;
}

export async function exportCsv(): Promise<number> {
  const rows = await getExportRows();
  if (rows.length === 0) {
    return 0;
  }
  const file = writeFile('gym-bae-workouts.csv', buildCsv(rows));
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'text/csv',
      dialogTitle: 'Export workouts',
    });
  }
  return rows.length;
}

export async function createBackup(): Promise<void> {
  const data = await exportDatabaseData();
  const file = writeFile('gym-bae-backup.json', JSON.stringify(data, null, 2));
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'application/json',
      dialogTitle: 'Export database backup',
    });
  }
}

export async function pickBackupFile(): Promise<BackupData | null> {
  const picked = await File.pickFileAsync({ mimeTypes: ['application/json'] });
  if (picked.canceled || !picked.result) {
    return null;
  }
  const content = await picked.result.text();
  return JSON.parse(content) as BackupData;
}

export async function restoreBackup(): Promise<BackupData> {
  const data = await pickBackupFile();
  if (!data) {
    throw new Error('canceled');
  }
  await restoreDatabaseData(data);
  return data;
}
