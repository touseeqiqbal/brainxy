import BrainyxKit
import BrainyxProtocol
import Foundation

// Prefer the BrainyxKit wrapper to keep gateway request payloads consistent.
typealias AnyCodable = BrainyxKit.AnyCodable
typealias InstanceIdentity = BrainyxKit.InstanceIdentity

extension AnyCodable {
    var stringValue: String? { self.value as? String }
    var boolValue: Bool? { self.value as? Bool }
    var intValue: Int? { self.value as? Int }
    var doubleValue: Double? { self.value as? Double }
    var dictionaryValue: [String: AnyCodable]? { self.value as? [String: AnyCodable] }
    var arrayValue: [AnyCodable]? { self.value as? [AnyCodable] }

    var foundationValue: Any {
        switch self.value {
        case let dict as [String: AnyCodable]:
            dict.mapValues { $0.foundationValue }
        case let array as [AnyCodable]:
            array.map(\.foundationValue)
        default:
            self.value
        }
    }
}

extension BrainyxProtocol.AnyCodable {
    var stringValue: String? { self.value as? String }
    var boolValue: Bool? { self.value as? Bool }
    var intValue: Int? { self.value as? Int }
    var doubleValue: Double? { self.value as? Double }
    var dictionaryValue: [String: BrainyxProtocol.AnyCodable]? { self.value as? [String: BrainyxProtocol.AnyCodable] }
    var arrayValue: [BrainyxProtocol.AnyCodable]? { self.value as? [BrainyxProtocol.AnyCodable] }

    var foundationValue: Any {
        switch self.value {
        case let dict as [String: BrainyxProtocol.AnyCodable]:
            dict.mapValues { $0.foundationValue }
        case let array as [BrainyxProtocol.AnyCodable]:
            array.map(\.foundationValue)
        default:
            self.value
        }
    }
}
