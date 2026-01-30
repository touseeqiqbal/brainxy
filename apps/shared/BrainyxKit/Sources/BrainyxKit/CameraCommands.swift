import Foundation

public enum BrainyxCameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum BrainyxCameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum BrainyxCameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum BrainyxCameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct BrainyxCameraSnapParams: Codable, Sendable, Equatable {
    public var facing: BrainyxCameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: BrainyxCameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: BrainyxCameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: BrainyxCameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct BrainyxCameraClipParams: Codable, Sendable, Equatable {
    public var facing: BrainyxCameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: BrainyxCameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: BrainyxCameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: BrainyxCameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
