// Data container class for transferring settings via peerSocket.
export default class StorageData {
  constructor(readonly key: string, readonly value: any) {}
}
