// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "BrainyxKit",
    platforms: [
        .iOS(.v18),
        .macOS(.v15),
    ],
    products: [
        .library(name: "BrainyxProtocol", targets: ["BrainyxProtocol"]),
        .library(name: "BrainyxKit", targets: ["BrainyxKit"]),
        .library(name: "BrainyxChatUI", targets: ["BrainyxChatUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/steipete/ElevenLabsKit", exact: "0.1.0"),
        .package(url: "https://github.com/gonzalezreal/textual", exact: "0.3.1"),
    ],
    targets: [
        .target(
            name: "BrainyxProtocol",
            path: "Sources/BrainyxProtocol",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "BrainyxKit",
            dependencies: [
                "BrainyxProtocol",
                .product(name: "ElevenLabsKit", package: "ElevenLabsKit"),
            ],
            path: "Sources/BrainyxKit",
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "BrainyxChatUI",
            dependencies: [
                "BrainyxKit",
                .product(
                    name: "Textual",
                    package: "textual",
                    condition: .when(platforms: [.macOS, .iOS])),
            ],
            path: "Sources/BrainyxChatUI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "BrainyxKitTests",
            dependencies: ["BrainyxKit", "BrainyxChatUI"],
            path: "Tests/BrainyxKitTests",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
