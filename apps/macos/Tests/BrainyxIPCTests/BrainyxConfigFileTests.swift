import Foundation
import Testing
@testable import Brainyx

@Suite(.serialized)
struct BrainyxConfigFileTests {
    @Test
    func configPathRespectsEnvOverride() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("brainyx-config-\(UUID().uuidString)")
            .appendingPathComponent("brainyx.json")
            .path

        await TestIsolation.withEnvValues(["BRAINYX_CONFIG_PATH": override]) {
            #expect(BrainyxConfigFile.url().path == override)
        }
    }

    @MainActor
    @Test
    func remoteGatewayPortParsesAndMatchesHost() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("brainyx-config-\(UUID().uuidString)")
            .appendingPathComponent("brainyx.json")
            .path

        await TestIsolation.withEnvValues(["BRAINYX_CONFIG_PATH": override]) {
            BrainyxConfigFile.saveDict([
                "gateway": [
                    "remote": [
                        "url": "ws://gateway.ts.net:19999",
                    ],
                ],
            ])
            #expect(BrainyxConfigFile.remoteGatewayPort() == 19999)
            #expect(BrainyxConfigFile.remoteGatewayPort(matchingHost: "gateway.ts.net") == 19999)
            #expect(BrainyxConfigFile.remoteGatewayPort(matchingHost: "gateway") == 19999)
            #expect(BrainyxConfigFile.remoteGatewayPort(matchingHost: "other.ts.net") == nil)
        }
    }

    @MainActor
    @Test
    func setRemoteGatewayUrlPreservesScheme() async {
        let override = FileManager().temporaryDirectory
            .appendingPathComponent("brainyx-config-\(UUID().uuidString)")
            .appendingPathComponent("brainyx.json")
            .path

        await TestIsolation.withEnvValues(["BRAINYX_CONFIG_PATH": override]) {
            BrainyxConfigFile.saveDict([
                "gateway": [
                    "remote": [
                        "url": "wss://old-host:111",
                    ],
                ],
            ])
            BrainyxConfigFile.setRemoteGatewayUrl(host: "new-host", port: 2222)
            let root = BrainyxConfigFile.loadDict()
            let url = ((root["gateway"] as? [String: Any])?["remote"] as? [String: Any])?["url"] as? String
            #expect(url == "wss://new-host:2222")
        }
    }

    @Test
    func stateDirOverrideSetsConfigPath() async {
        let dir = FileManager().temporaryDirectory
            .appendingPathComponent("brainyx-state-\(UUID().uuidString)", isDirectory: true)
            .path

        await TestIsolation.withEnvValues([
            "BRAINYX_CONFIG_PATH": nil,
            "BRAINYX_STATE_DIR": dir,
        ]) {
            #expect(BrainyxConfigFile.stateDirURL().path == dir)
            #expect(BrainyxConfigFile.url().path == "\(dir)/brainyx.json")
        }
    }
}
