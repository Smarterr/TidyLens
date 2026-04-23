import ExpoModulesCore
import Photos

public class NativePhotosModule: Module {
  public func definition() -> ModuleDefinition {
    Name("NativePhotos")

    AsyncFunction("getPhotos") { (includeICloud: Bool) -> [[String: Any]] in
      var results = [[String: Any]]()

      let fetchOptions = PHFetchOptions()
      fetchOptions.predicate = NSPredicate(format: "mediaType == %d || mediaType == %d", PHAssetMediaType.image.rawValue, PHAssetMediaType.video.rawValue)

      let allAssets = PHAsset.fetchAssets(with: fetchOptions)

      allAssets.enumerateObjects { (asset, index, stop) in
        var sizeInBytes: Int64 = 0
        var isICloud = false

        let resources = PHAssetResource.assetResources(for: asset)
        
        if let resource = resources.first {
          // 1. Get the real file size
          if let fileSize = (resource as AnyObject).value(forKey: "fileSize") as? Int64 {
            sizeInBytes = fileSize
          }
          
          // 2. THE FIX: 'locallyAvailable' tells us if the full file is physically on the iPhone's SSD.
          if let locallyAvailable = (resource as AnyObject).value(forKey: "locallyAvailable") as? Bool {
            // If it is NOT locally available, it means it is taking up iCloud storage, not device storage.
            isICloud = !locallyAvailable
          }
        }

        let fileSizeMB = Double(sizeInBytes) / (1024.0 * 1024.0)
        let isScreenshot = (asset.mediaSubtypes.rawValue & PHAssetMediaSubtype.photoScreenshot.rawValue) != 0

        results.append([
          "id": asset.localIdentifier,
          "uri": "ph://\(asset.localIdentifier)",
          "mediaType": asset.mediaType == .video ? "video" : "photo",
          "creationTime": (asset.creationDate?.timeIntervalSince1970 ?? 0) * 1000,
          "fileSizeMB": (fileSizeMB * 100).rounded() / 100, 
          "isICloud": isICloud,
          "isScreenshot": isScreenshot
        ])
      }

      return results
    }
  }
}