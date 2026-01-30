// swift-tools-version: 6.2
// Package manifest for the Brainyx macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "Brainyx",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "BrainyxIPC", targets: ["BrainyxIPC"]),
        .library(name: "BrainyxDiscovery", targets: ["BrainyxDiscovery"]),
        .executable(name: "Brainyx", targets: ["Brainyx"]),
        .executable(name: "brainyx-mac", targets: ["BrainyxMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/BrainyxKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "BrainyxIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "BrainyxDiscovery",
            dependencies: [
                .product(name: "BrainyxKit", package: "BrainyxKit"),
            ],
            path: "Sources/BrainyxDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "Brainyx",
            dependencies: [
                "BrainyxIPC",
                "BrainyxDiscovery",
                .product(name: "BrainyxKit", package: "BrainyxKit"),
                .product(name: "BrainyxChatUI", package: "BrainyxKit"),
                .product(name: "BrainyxProtocol", package: "BrainyxKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/Brainyx.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "BrainyxMacCLI",
            dependencies: [
                "BrainyxDiscovery",
                .product(name: "BrainyxKit", package: "BrainyxKit"),
                .product(name: "BrainyxProtocol", package: "BrainyxKit"),
            ],
            path: "Sources/BrainyxMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "BrainyxIPCTests",
            dependencies: [
                "BrainyxIPC",
                "Brainyx",
                "BrainyxDiscovery",
                .product(name: "BrainyxProtocol", package: "BrainyxKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
