import Foundation

public enum BrainyxChatTransportEvent: Sendable {
    case health(ok: Bool)
    case tick
    case chat(BrainyxChatEventPayload)
    case agent(BrainyxAgentEventPayload)
    case seqGap
}

public protocol BrainyxChatTransport: Sendable {
    func requestHistory(sessionKey: String) async throws -> BrainyxChatHistoryPayload
    func sendMessage(
        sessionKey: String,
        message: String,
        thinking: String,
        idempotencyKey: String,
        attachments: [BrainyxChatAttachmentPayload]) async throws -> BrainyxChatSendResponse

    func abortRun(sessionKey: String, runId: String) async throws
    func listSessions(limit: Int?) async throws -> BrainyxChatSessionsListResponse

    func requestHealth(timeoutMs: Int) async throws -> Bool
    func events() -> AsyncStream<BrainyxChatTransportEvent>

    func setActiveSessionKey(_ sessionKey: String) async throws
}

extension BrainyxChatTransport {
    public func setActiveSessionKey(_: String) async throws {}

    public func abortRun(sessionKey _: String, runId _: String) async throws {
        throw NSError(
            domain: "BrainyxChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "chat.abort not supported by this transport"])
    }

    public func listSessions(limit _: Int?) async throws -> BrainyxChatSessionsListResponse {
        throw NSError(
            domain: "BrainyxChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.list not supported by this transport"])
    }
}
