; AutoHotkey script: capture active window size and apply to WordPad
; Hotkeys:
;   Ctrl+Shift+C  - Capture active window position and size
;   Ctrl+Shift+V  - Apply captured size to the first WordPad window found
;   Ctrl+Shift+R  - Reset captured values
;   Ctrl+Shift+Q  - Exit script

CapturedX := ""
CapturedY := ""
CapturedW := ""
CapturedH := ""
PopupShown := false
AutoShowOnWordpad := true ; set to false to disable auto popup when WordPad is activated

^+c::
; Capture active window position and size
WinGetTitle, winTitle, A
WinGetPos, X, Y, W, H, A
CapturedX := X
CapturedY := Y
CapturedW := W
CapturedH := H
ToolTip, Captured size: %W% x %H%`nPosition: %X% , %Y%, 1
SetTimer, RemoveToolTip, -1500
Return

RemoveToolTip:
ToolTip
Return

^+v::
; Apply captured size to WordPad window
if (CapturedW = "")
{
    MsgBox, 48, No Size, No size captured. Activate the popup and press Ctrl+Shift+C first.
    Return
}

; Try to find WordPad by executable name
if !WinExist("ahk_exe wordpad.exe")
{
    MsgBox, 48, WordPad Not Found, Could not find WordPad (wordpad.exe). Make sure WordPad is running.
    Return
}

; Get first WordPad window id
WinGet, wp_id, ID, ahk_exe wordpad.exe
; Move/resize the window. Keep same X/Y from captured popup.
WinMove, ahk_id %wp_id%, , %CapturedX%, %CapturedY%, %CapturedW%, %CapturedH%
Return

; --- Auto-show popup mock when WordPad is activated ---
; Uses the local popup_mock.html file in the same folder as this script.
; When WordPad becomes the active window, the HTML file is opened in the default browser
; and the resulting browser window is positioned/resized to match the captured popup size.

SetTimer, WatchActive, 350

WatchActive:
    if (!AutoShowOnWordpad)
        Return
    ; if WordPad is now active and we haven't shown the popup for this activation
    if WinActive("ahk_exe wordpad.exe")
    {
        if (!PopupShown)
        {
            ; only proceed if we have captured a size
            if (CapturedW = "")
            {
                ; do nothing — user hasn't captured the popup yet
                Return
            }
            ; build path to popup file
            popupPath := A_ScriptDir "\\popup_mock.html"
            Run, %popupPath%
            ; wait briefly for the browser window/tab to become active
            Sleep, 600
            ; get the active window and move it to captured position/size
            WinGet, new_id, ID, A
            if (new_id)
            {
                WinMove, ahk_id %new_id%, , %CapturedX%, %CapturedY%, %CapturedW%, %CapturedH%
                PopupShown := true
            }
        }
    }
    else
    {
        PopupShown := false
    }
Return

^+r::
; Reset captured values
CapturedX := ""
CapturedY := ""
CapturedW := ""
CapturedH := ""
MsgBox, 64, Reset, Captured values cleared.
Return

^+q::
ExitApp
Return

; Optional: show current captured values with Ctrl+Shift+S
^+s::
if (CapturedW = "")
    MsgBox, 64, Captured, No values captured.
else
    MsgBox, 64, Captured, Size: %CapturedW% x %CapturedH%`nPosition: %CapturedX% , %CapturedY%
Return

; --- Adjustment hotkeys ---
; Ctrl+Shift+Right  : increase width by 20 px
; Ctrl+Shift+Left   : decrease width by 20 px
; Ctrl+Shift+Up     : increase height by 20 px
; Ctrl+Shift+Down   : decrease height by 20 px
; Ctrl+Shift+Enter  : prompt to set exact width x height

^+Right::
    AdjustCapturedSize(20, 0)
Return

^+Left::
    AdjustCapturedSize(-20, 0)
Return

^+Up::
    AdjustCapturedSize(0, 20)
Return

^+Down::
    AdjustCapturedSize(0, -20)
Return

^+Enter::
    if (CapturedW = "")
    {
        MsgBox, 48, No Size, No size captured. Press Ctrl+Shift+C first.
        Return
    }
    InputBox, userSize, Set Size, Enter width and height separated by x (e.g. 800x600):
    if ErrorLevel
        Return
    StringReplace, userSize, userSize, %A_Space%, , All
    if InStr(userSize, "x")
    {
        StringSplit, parts, userSize, x
        newW := parts1
        newH := parts2
        if (newW > 0 && newH > 0)
        {
            CapturedW := newW
            CapturedH := newH
            ToolTip, New captured size: %CapturedW% x %CapturedH%, 1
            SetTimer, RemoveToolTip, -1500
        }
        else
            MsgBox, 48, Invalid, Width and height must be positive numbers.
    }
    else
    {
        MsgBox, 48, Invalid, Please use the format WIDTHxHEIGHT, e.g. 1024x768
    }
Return

AdjustCapturedSize(dW, dH)
{
    global CapturedW, CapturedH
    if (CapturedW = "")
    {
        MsgBox, 48, No Size, No size captured. Press Ctrl+Shift+C first.
        Return
    }
    CapturedW := CapturedW + dW
    CapturedH := CapturedH + dH
    if (CapturedW < 100)
        CapturedW := 100
    if (CapturedH < 50)
        CapturedH := 50
    ToolTip, Adjusted captured size: %CapturedW% x %CapturedH%, 1
    SetTimer, RemoveToolTip, -1500
}
