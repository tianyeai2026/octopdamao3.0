Unicode true
!include "MUI2.nsh"

Name "全全老师"
OutFile "QuanQuanLaoShi_0.2.0_x64-setup.exe"
InstallDir "$PROGRAMFILES64\全全老师"
InstallDirRegKey HKLM "Software\全全老师" "InstallDir"
RequestExecutionLevel admin
VIProductVersion "0.2.0.0"
VIAddVersionKey "ProductName" "全全老师"
VIAddVersionKey "CompanyName" "全全老师"
VIAddVersionKey "FileDescription" "全全老师"
VIAddVersionKey "FileVersion" "0.2.0.0"
VIAddVersionKey "ProductVersion" "0.2.0.0"
VIAddVersionKey "LegalCopyright" "全全老师"

!define MUI_ICON "..\src-tauri\icons\icon.ico"
!define MUI_UNICON "..\src-tauri\icons\icon.ico"
!define MUI_ABORTWARNING

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!define MUI_FINISHPAGE_RUN "$INSTDIR\octop-pet.exe"
!define MUI_FINISHPAGE_RUN_TEXT "启动全全老师"
!insertmacro MUI_PAGE_FINISH

!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES

!insertmacro MUI_LANGUAGE "SimpChinese"

Section "MainProgram"
  SetOutPath "$INSTDIR"
  File /oname=octop-pet.exe "..\src-tauri\target\release\octop-pet.exe"
  WriteUninstaller "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "Software\全全老师" "InstallDir" "$INSTDIR"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\全全老师" "DisplayName" "全全老师"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\全全老师" "UninstallString" '"$INSTDIR\uninst.exe"'
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\全全老师" "DisplayIcon" "$INSTDIR\octop-pet.exe"
  WriteRegStr HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\全全老师" "DisplayVersion" "0.2.0"
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\全全老师" "NoModify" 1
  WriteRegDWORD HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\全全老师" "NoRepair" 1
  CreateDirectory "$SMPROGRAMS\全全老师"
  CreateShortcut "$SMPROGRAMS\全全老师\全全老师.lnk" "$INSTDIR\octop-pet.exe" "" "$INSTDIR\octop-pet.exe" 0
  CreateShortcut "$SMPROGRAMS\全全老师\卸载全全老师.lnk" "$INSTDIR\uninst.exe" "" "$INSTDIR\uninst.exe" 0
  CreateShortcut "$DESKTOP\全全老师.lnk" "$INSTDIR\octop-pet.exe" "" "$INSTDIR\octop-pet.exe" 0
SectionEnd

Section "Uninstall"
  Delete "$INSTDIR\octop-pet.exe"
  Delete "$INSTDIR\uninst.exe"
  RMDir "$INSTDIR"
  Delete "$SMPROGRAMS\全全老师\全全老师.lnk"
  Delete "$SMPROGRAMS\全全老师\卸载全全老师.lnk"
  RMDir "$SMPROGRAMS\全全老师"
  Delete "$DESKTOP\全全老师.lnk"
  DeleteRegKey HKLM "Software\Microsoft\Windows\CurrentVersion\Uninstall\全全老师"
  DeleteRegKey HKLM "Software\全全老师"
SectionEnd
