#!/usr/bin/env ruby
# frozen_string_literal: true
#
# add_ui_test_target.rb
#
# One-off script: adds a `SadhanaUITests` UI testing target to the Xcode
# project so the journey-acceptance suite in
# `ios/SadhanaUITests/JourneyAcceptanceTests.swift` can be executed by
# `xcodebuild test`. Idempotent — re-runs are safe and skip if the target
# already exists.
#
# Run via the project's bundler-managed CocoaPods environment so the
# xcodeproj gem (already a CocoaPods transitive dependency) is resolved:
#
#   cd ios && bundle exec ruby scripts/add_ui_test_target.rb
#

require 'xcodeproj'

PROJECT_PATH = File.expand_path('../Sadhana.xcodeproj', __dir__)
UI_TEST_NAME = 'SadhanaUITests'
APP_TARGET_NAME = 'Sadhana'
BUNDLE_ID = 'com.sankalpsthakur.sadhana.uitests'
UI_TEST_DIR = File.expand_path("../#{UI_TEST_NAME}", __dir__)

project = Xcodeproj::Project.open(PROJECT_PATH)

if project.targets.any? { |t| t.name == UI_TEST_NAME }
  puts "[ok] target '#{UI_TEST_NAME}' already exists — nothing to do."
  exit 0
end

app_target = project.targets.find { |t| t.name == APP_TARGET_NAME }
raise "missing app target #{APP_TARGET_NAME}" unless app_target

# Create the UI testing target.
ui_test_target = project.new_target(
  :ui_test_bundle,
  UI_TEST_NAME,
  :ios,
  '15.1',
  project.products_group,
  :swift
)

# Add the test sources from disk to the new target's group.
group = project.main_group.find_subpath(UI_TEST_NAME, true)
group.set_source_tree('<group>')
group.set_path(UI_TEST_NAME)

Dir.glob(File.join(UI_TEST_DIR, '*.swift')).sort.each do |swift_file|
  rel = File.basename(swift_file)
  file_ref = group.new_reference(rel)
  ui_test_target.add_file_references([file_ref])
end

# Add Info.plist as a resource (not compiled — referenced by build settings).
plist_path = File.join(UI_TEST_DIR, 'Info.plist')
if File.exist?(plist_path)
  group.new_reference('Info.plist') unless group.files.any? { |f| f.path == 'Info.plist' }
end

# Wire build settings: bundle id, deployment target, swift version, test target.
ui_test_target.build_configurations.each do |config|
  config.build_settings.merge!(
    'PRODUCT_BUNDLE_IDENTIFIER' => BUNDLE_ID,
    'PRODUCT_NAME' => '$(TARGET_NAME)',
    'TEST_TARGET_NAME' => APP_TARGET_NAME,
    'SWIFT_VERSION' => '5.0',
    'IPHONEOS_DEPLOYMENT_TARGET' => '15.1',
    'LD_RUNPATH_SEARCH_PATHS' => [
      '$(inherited)',
      '@executable_path/Frameworks',
      '@loader_path/Frameworks'
    ],
    'TARGETED_DEVICE_FAMILY' => '1,2',
    'CODE_SIGN_STYLE' => 'Automatic',
    'GENERATE_INFOPLIST_FILE' => 'YES',
    'INFOPLIST_FILE' => "#{UI_TEST_NAME}/Info.plist",
    'ALWAYS_EMBED_SWIFT_STANDARD_LIBRARIES' => 'NO'
  )
end

# Declare a dependency: UI tests build after (and embed alongside) the app.
ui_test_target.add_dependency(app_target)

project.save

puts "[ok] added '#{UI_TEST_NAME}' target with #{ui_test_target.source_build_phase.files.count} source file(s)."
puts '[hint] regenerate the Sadhana scheme to add the UI test target to its <Testables>.'
