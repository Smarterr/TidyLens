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

        // 1. Get the resources for the asset (this is where the size and cloud info lives)
        let resources = PHAssetResource.assetResources(for: asset)
        
        if let resource = resources.first {
          // Use 'fileSize' safely. If it's not there, we don't crash, we just assume 0.
          if let fileSize = (resource as AnyObject).value(forKey: "fileSize") as? Int64 {
            sizeInBytes = fileSize
          }
          
          // 2. SAFE ICLOUD CHECK: 
          // If the size is 0 but it's a valid photo, it's almost certainly an iCloud placeholder.
          // Also check if it's a "Cloud Shared" asset.
          if sizeInBytes == 0 || asset.sourceType == .typeCloudShared {
            isICloud = true
          }
        }

        // Skip if user doesn't want iCloud photos
        if !includeICloud && isICloud {
            return 
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